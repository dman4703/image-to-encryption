# Image to Encryption

A web application that leverages image entropy for cryptographic operations, developed by Devon O'Quinn.

## Overview

Image to Encryption is a unique tool that uses the inherent randomness in images to generate cryptographic elements. Inspired by Cloudflare's wall of lava lamps (which they use for entropy generation), this application allows users to create secure passwords, public/private key pairs, and encrypt/decrypt files using their own images as entropy sources.

## Features

- **Password Generation**: Create strong, random passwords using image data
- **Public/Private Key Generation**: Generate asymmetric key pairs for secure communication
- **File Encryption/Decryption**: Securely encrypt and decrypt files using image-based keys
- **Entropy Visualization**: Real-time entropy measurement of uploaded images
- **Camera Integration**: Take photos directly through the web interface
- **Salt-based Customization**: Add personal entropy through custom salt values

## Technologies Used

- **Frontend Framework**: Next.js 14 with React
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Dependencies

- React 19
- Next.js 15.1.6
- Tailwind CSS 3.4.1
- TypeScript 5
- ESLint

## Technical Implementation

The application uses several key technologies and built-in APIs:

- **Web Crypto API** for all cryptographic operations, including:
  - SHA-256 hashing for password generation
  - AES-GCM for file encryption
  - Key derivation from image data
- **Canvas API** for image processing and entropy calculation
- **File API** for handling file operations
- **MediaDevices API** for camera integration

## Challenges and Solutions

### File Decryption Complexity

One of the major challenges faced during development was implementing robust file decryption. The main issues included:

1. **Metadata Preservation**: Initially, decrypted files would lose their original filenames and MIME types. This was solved by implementing a metadata header system that stores file information alongside the encrypted data.

2. **Buffer Handling**: Working with ArrayBuffers and TypedArrays for large files proved tricky, especially when combining the IV (Initialization Vector) with the ciphertext. The solution involved careful buffer concatenation and slicing operations.

3. **Error Handling**: Early versions struggled with corrupted files or incorrect keys. Implemented comprehensive error checking and user feedback to make the process more robust and user-friendly.

## Installation

### Prerequisites
- **Node.js v19+**
- **npm or yarn installed** (npm is used in the commands below)

### Setup Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ImageEncryptionApp.git
   cd ImageEncryptionApp
   ```
2. Install Dependencies:
  ```bash
  npm install
  ```
3. Run the development server:
  ```bash
  npm run dev
  ```

## Usage

1. Select desired mode (Password/Public Key/File)
2. Upload an image or take a photo
3. Enter a salt value
4. Generate cryptographic elements or encrypt/decrypt files

## Security Considerations

- All cryptographic operations are performed client-side
- No data is sent to any server
- Image entropy is combined with user-provided salt for additional security
