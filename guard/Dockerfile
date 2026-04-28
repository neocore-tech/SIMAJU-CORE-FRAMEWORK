# Stage 1: Build Image
FROM rust:1.75-alpine as builder
WORKDIR /usr/src/app

# Install dependensi C library untuk Alpine
RUN apk add --no-cache musl-dev

# Salin manifesto file Cargo
COPY Cargo.toml Cargo.lock ./

# Buat dummy src agar dependensi di-compile terlebih dahulu (Caching Layer)
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release || true
RUN rm -rf src

# Salin source code asli
COPY src ./src

# Update mod time agar Cargo mendeteksi perubahan, lalu Build
RUN touch src/main.rs
RUN cargo build --release

# Stage 2: Minimal Production Image (ukurannya akan sangat kecil < 20MB)
FROM alpine:latest
WORKDIR /app

# Salin binary Rust yang sudah dicompile
COPY --from=builder /usr/src/app/target/release/simaju-guard ./

# Salin file konfigurasi (pastikan diedit sesuai kebutuhan production)
COPY guard.toml ./

# (Opsional) Salin sertifikat SSL jika ada
# COPY certs/ ./certs/

# Buka Port
EXPOSE 8080 8443 9000

# Jalankan Firewall
CMD ["./simaju-guard"]
