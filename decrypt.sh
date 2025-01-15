#!/bin/bash

# Path to encrypted file and the private key
encrypted_file="$1"
private_key_path="/path/to/private_key.pem"
decrypted_file="/path/to/output/decrypted_file"

# Decrypt the file using RSA private key
openssl rsautl -decrypt -inkey "$private_key_path" -in "$encrypted_file" -out "$decrypted_file"

echo "File decrypted successfully."
