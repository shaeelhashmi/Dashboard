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
		reader := csv.NewReader(strings.NewReader(string(csv_data)))
		records, err := reader.ReadAll()
		if err != nil {
			http.Error(w, "Error parsing CSV: "+err.Error(), http.StatusInternalServerError)
			return
		}
		fmt.Println(records)

		w.Header().Set("Content-Type", "text/csv")
		w.Write(csv_data)
	})

	// API endpoints
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
