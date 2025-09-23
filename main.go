package main

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"regexp"
	"strings"
	"time"
)

type RequestData struct {
	Parent_item string `json:"sub_item"`
	Gender      string `json:"gender"`
	RealItem    string `json:"item"`
}

func sanitize(name string) string {
	// convert spaces to underscores
	name = strings.ReplaceAll(name, " ", "_")

	// allow only letters, numbers, underscore, dash
	re := regexp.MustCompile(`[^a-zA-Z0-9_-]+`)
	name = re.ReplaceAllString(name, "_")

	return name
}
func makeFileName(req RequestData) string {
	parent := sanitize(req.Parent_item)
	gender := sanitize(req.Gender)

	// Example: Male_Shoes.csv
	return fmt.Sprintf("%s_%s", gender, parent)
}

// CORS middleware
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	// Load JSON file
	data, err := os.ReadFile("../categories.json")
	if err != nil {
		log.Fatalf("Error reading JSON file: %v", err)
	}

	var categories map[string]interface{}
	if err := json.Unmarshal(data, &categories); err != nil {
		log.Fatalf("Error unmarshalling JSON: %v", err)
	}

	male := categories["Male"]
	female := categories["Female"]

	mux := http.NewServeMux()

	// Serve all static files from ./Html
	// Serve new.html when visiting /home
	fs := http.FileServer(http.Dir("./Html"))
	mux.Handle("/", fs)
	mux.HandleFunc("/home", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./Html/new.html")
	})
	mux.HandleFunc("/data/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./Html/Products.html")
	})
	// API endpoints
	mux.HandleFunc("/get/items", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		data, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		fmt.Println("Received data:", string(data))

		var reqData RequestData
		if err := json.Unmarshal(data, &reqData); err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		fileName := makeFileName(reqData)
		csv_data, err := os.ReadFile("../output/" + fileName + "/" + reqData.RealItem + ".csv")
		if err != nil {
			http.Error(w, "Error reading CSV file: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "text/csv")
		w.Write(csv_data)
	})
	mux.HandleFunc("/save/image", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Received request to /save/image")
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}
		data, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()
		type RequestData2 struct {
			Items   []string `json:"items"`
			SubItem string   `json:"sub_item"`
			Item    string   `json:"item"`
			Gender  string   `json:"gender"`
		}

		var reqData RequestData2
		if err := json.Unmarshal(data, &reqData); err != nil {
			fmt.Println("Error unmarshalling JSON:", err)
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		// Check if directory exists, create if not
		selectedOutputsDir := "../selected_outputs"
		if _, err := os.Stat(selectedOutputsDir); os.IsNotExist(err) {
			err := os.MkdirAll(selectedOutputsDir, 0755)
			if err != nil {
				http.Error(w, "Error creating directory: "+err.Error(), http.StatusInternalServerError)
				return
			}
		}
		FolderName := makeFileName(RequestData{
			Parent_item: reqData.SubItem,
			Gender:      reqData.Gender,
			RealItem:    reqData.Item,
		})
		finalDir := selectedOutputsDir + "/" + FolderName
		if _, err := os.Stat(finalDir); os.IsNotExist(err) {
			err := os.MkdirAll(finalDir, 0755)
			if err != nil {
				http.Error(w, "Error creating directory: "+err.Error(), http.StatusInternalServerError)
				return
			}
		}
		currentTime := time.Now().Format("20060102150405.000")
		File, err := os.Create("../selected_outputs/" + FolderName + "/" + reqData.Item + "_" + currentTime + ".csv")
		if err != nil {
			http.Error(w, "Error creating file: "+err.Error(), http.StatusInternalServerError)
			return
		}
		fmt.Println(File)
		defer File.Close()
		csvWriter := csv.NewWriter(File)
		defer csvWriter.Flush()
		// Write header if needed
		err = csvWriter.Write([]string{"URL"})
		if err != nil {
			http.Error(w, "Error writing CSV header: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Write each URL as a separate row
		for _, item := range reqData.Items {
			err = csvWriter.Write([]string{item})
			if err != nil {
				http.Error(w, "Error writing CSV data: "+err.Error(), http.StatusInternalServerError)
				return
			}
		}
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Image received"))
	})

	mux.HandleFunc("/categories/male", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(male)
	})
	mux.HandleFunc("/categories/female", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(female)
	})

	// Wrap mux with CORS middleware
	handler := corsMiddleware(mux)

	fmt.Println("Server running at http://localhost:8080")
	if err := http.ListenAndServe(":8080", handler); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
