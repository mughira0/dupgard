use sha2::{Digest, Sha256};
use std::collections::HashMap;
use std::fs;
use walkdir::WalkDir;

#[tauri::command]
pub async fn scan_for_duplicates(path: String) -> Vec<Vec<String>> {
    let mut file_hashmap: HashMap<String, Vec<String>> = HashMap::new();
    traverse(path, &mut file_hashmap);

    let mut duplicates: Vec<Vec<String>> = Vec::new();
    for (_, val) in &file_hashmap {
        if val.len() > 1 {
            duplicates.push(val.clone());
        }
    }
    duplicates
}

fn traverse(path: String, file_hashmap: &mut HashMap<String, Vec<String>>) {
    for entry in WalkDir::new(path) {
        let entry = entry.unwrap();
        if entry.file_type().is_file() {
            let hash: String = hash_file(entry.path().to_str().unwrap());
            let file_path: String = entry.path().to_str().unwrap().to_string();
            file_hashmap
                .entry(hash)
                .or_insert_with(Vec::new)
                .push(file_path);
        }
    }
}

fn hash_file(path: &str) -> String {
    let bytes: Vec<u8> = fs::read(path).unwrap();
    let hash = Sha256::digest(&bytes);
    hex::encode(hash)
}
