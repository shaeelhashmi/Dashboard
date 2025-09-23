package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
)

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

	fmt.Println("Loaded Male:", male)
	fmt.Println("Loaded Female:", female)

	mux := http.NewServeMux()

	// Serve all static files from ./Html
	// Serve new.html when visiting /home
	fs := http.FileServer(http.Dir("./Html"))
	mux.Handle("/", fs)
	mux.HandleFunc("/home", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./Html/new.html")
	})

	// Serve all other static files (JS, CSS, images) from ./Html

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
