# Kubernetes Setup Instructions

## Before You Start

### Prerequisites

1. **Kubernetes Cluster**
   - Minikube (local development)
   - EKS (AWS)
   - GKE (Google Cloud)
   - AKS (Azure)
   - DigitalOcean Kubernetes
   - Or any managed Kubernetes service

2. **Tools Required**
   - `kubectl` (Kubernetes CLI)
   - `docker` (for building and pushing images)
   - `git` (for version control)

3. **Account Access**
   - Container registry account (Docker Hub, ECR, GCR, etc.)
   - Kubernetes cluster access (kubeconfig file)
   - Domain name (for Ingress)

---

## Step 1: Install and Configure kubectl

### Linux/macOS

```bash
# Download kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"

# Make it executable
chmod +x ./kubectl

# Move to PATH
sudo mv ./kubectl /usr/local/bin/kubectl

# Verify installation
kubectl version --client
```

### Windows

Download from: https://dl.k8s.io/release/stable.exe

Or using Chocolatey:
```bash
choco install kubernetes-cli
```

---

## Step 2: Configure kubectl Access

### Get Kubeconfig

**For Minikube:**
```bash
# Start Minikube
minikube start

# Get kubeconfig path
kubectl config view

# kubeconfig is usually at ~/.kube/config
```

**For Cloud Providers:**

**AWS EKS:**
```bash
# Configure AWS credentials
aws configure

# Update kubeconfig
aws eks update-kubeconfig --region us-east-1 --name my-cluster
```

**Google Cloud GKE:**
```bash
# Configure gcloud
gcloud init

# Get credentials
gcloud container clusters get-credentials my-cluster --zone us-central1-a
```

**Azure AKS:**
```bash
# Configure Azure CLI
az login

# Get credentials
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

### Verify kubectl Access

```bash
# Test cluster connection
kubectl cluster-info

# View current context
kubectl config current-context

# List nodes
kubectl get nodes
```

---

## Step 3: Enable Required Kubernetes Features

### Ingress Controller

You need an Ingress Controller to route traffic.

**For Minikube:**
```bash
# Enable ingress addon
minikube addons enable ingress

# Verify
kubectl get pods -n ingress-nginx
```

**For EKS:**
```bash
# Install nginx-ingress using Helm
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm install nginx-ingress ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.type=LoadBalancer
```

**For GKE:**
```bash
# GKE has built-in ingress, but you can also use nginx-ingress
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.0/deploy/static/provider/cloud/deploy.yaml
```

**For AKS:**
```bash
# Create ingress controller
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm install nginx-ingress ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.type=LoadBalancer
```

### Metrics Server (for HPA)

```bash
# For Minikube (usually included)
minikube addons enable metrics-server

# For other clusters
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Verify
kubectl get deployment metrics-server -n kube-system
```

### cert-manager (for SSL/TLS) - Optional

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Verify installation
kubectl get pods -n cert-manager

# Apply certificate issuers (after editing cert-issuer.yaml)
kubectl apply -f k8s/cert-issuer.yaml
```

---

## Step 4: Build and Push Docker Images

### Build Backend Image

```bash
# Navigate to backend directory
cd node-backend-reference

# Build image
docker build -t your-registry/book-manager-backend:latest .

# Push to registry
docker push your-registry/book-manager-backend:latest
```

### Build Frontend Image

```bash
# Navigate to frontend directory
cd ../book-app-frontend

# Build image
docker build -t your-registry/book-manager-frontend:latest .

# Push to registry
docker push your-registry/book-manager-frontend:latest
```

### For Local Development (Minikube)

If using Minikube, you can skip the registry:

```bash
# Configure Docker to use Minikube's Docker daemon
eval $(minikube docker-env)

# Build images (they're now available in Minikube)
docker build -t book-manager-backend:latest ./node-backend-reference
docker build -t book-manager-frontend:latest ./book-app-frontend

# Update deployment YAML to use imagePullPolicy: Never
kubectl set env deployment/backend IMAGE_PULL_POLICY=Never -n book-manager
```

---

## Step 5: Prepare Environment Variables

### Edit Configuration Files

**1. Update backend-deployment.yaml**

```yaml
image: your-registry/book-manager-backend:latest  # Change to your image
```

**2. Update frontend-deployment.yaml**

```yaml
image: your-registry/book-manager-frontend:latest  # Change to your image
```

**3. Update ingress.yaml**

```yaml
- host: www.yourdomain.com     # Change to your domain
- host: api.yourdomain.com     # Change to your domain
```

**4. Update cert-issuer.yaml**

```yaml
email: your-email@yourdomain.com  # Change to your email
```

### Create Secrets File (optional, for automation)

Create a `secrets.sh` file:

```bash
#!/bin/bash

export DB_PASS="your-secure-password"
export JWT_SECRET="your-super-secret-jwt-key"
export DOCKER_REGISTRY="your-registry"
export DOMAIN="yourdomain.com"
export EMAIL="your-email@yourdomain.com"
```

Then source it:
```bash
source secrets.sh
```

---

## Step 6: Deploy Application

### Quick Start (Interactive)

```bash
# Make deployment script executable
chmod +x k8s/deploy.sh

# Run deployment script
./k8s/deploy.sh
```

The script will prompt you for sensitive information.

### Manual Deployment

```bash
# 1. Create namespace
kubectl apply -f k8s/namespace.yaml

# 2. Create secrets
kubectl create secret generic backend-secret \
  --from-literal=DB_NAME=extio_learn_db \
  --from-literal=DB_USER=postgres \
  --from-literal=DB_PASS="your-secure-password" \
  --from-literal=JWT_SECRET="your-super-secret-jwt-key" \
  -n book-manager

# 3. Create ConfigMaps
kubectl create configmap frontend-config \
  --from-literal=VITE_API_URL=https://api.yourdomain.com/api \
  -n book-manager

# 4. Deploy PostgreSQL
kubectl apply -f k8s/postgres-pvc.yaml -n book-manager
kubectl apply -f k8s/postgres-deployment.yaml -n book-manager
kubectl apply -f k8s/postgres-service.yaml -n book-manager

# Wait for PostgreSQL
kubectl wait --for=condition=ready pod -l app=postgres -n book-manager --timeout=300s

# 5. Deploy Backend
kubectl apply -f k8s/backend-deployment.yaml -n book-manager
kubectl apply -f k8s/backend-service.yaml -n book-manager

# Wait for Backend
kubectl wait --for=condition=ready pod -l app=backend -n book-manager --timeout=300s

# 6. Deploy Frontend
kubectl apply -f k8s/frontend-deployment.yaml -n book-manager
kubectl apply -f k8s/frontend-service.yaml -n book-manager

# 7. Deploy Ingress
kubectl apply -f k8s/ingress.yaml -n book-manager

# 8. (Optional) Deploy HPA
kubectl apply -f k8s/hpa.yaml -n book-manager
```

---

## Step 7: Verify Deployment

```bash
# Check all resources
kubectl get all -n book-manager

# Check pods
kubectl get pods -n book-manager

# Check services
kubectl get svc -n book-manager

# Check ingress
kubectl get ingress -n book-manager

# Get Ingress IP/Hostname
kubectl get ingress -n book-manager -o wide
```

---

## Step 8: Configure DNS (if needed)

### Update DNS Records

Once you have the Ingress IP or hostname from Step 7:

**Using A Records (for static IP):**
```
www.yourdomain.com  IN  A  <INGRESS_IP>
api.yourdomain.com  IN  A  <INGRESS_IP>
```

**Using CNAME (for hostname):**
```
www.yourdomain.com  IN  CNAME  <INGRESS_HOSTNAME>
api.yourdomain.com  IN  CNAME  <INGRESS_HOSTNAME>
```

**For Minikube (local testing):**

Add to `/etc/hosts` (macOS/Linux) or `C:\Windows\System32\drivers\etc\hosts` (Windows):
```
<MINIKUBE_IP>  www.yourdomain.local
<MINIKUBE_IP>  api.yourdomain.local
```

Get Minikube IP:
```bash
minikube ip
```

---

## Step 9: Access Application

### URLs

- **Frontend**: `https://www.yourdomain.com`
- **Backend API**: `https://api.yourdomain.com/api`
- **Health Check**: `https://api.yourdomain.com/api/health`

### Test Access

```bash
# Test with curl
curl https://api.yourdomain.com/api/health

# Port forward for local testing
kubectl port-forward svc/backend-service 8443:8443 -n book-manager
# Access at: https://localhost:8443/api
```

---

## Common Issues and Solutions

### Issue: Pods won't start

**Solution:**
```bash
# Check pod status and events
kubectl describe pod <pod-name> -n book-manager

# Check pod logs
kubectl logs <pod-name> -n book-manager

# Check events
kubectl get events -n book-manager
```

### Issue: Database connection refused

**Solution:**
```bash
# Verify database pod is running
kubectl get pods -l app=postgres -n book-manager

# Check database logs
kubectl logs -l app=postgres -n book-manager

# Test connection from backend pod
kubectl exec -it <backend-pod> -n book-manager -- nc -zv postgres-service 5432
```

### Issue: Ingress shows PENDING

**Solution:**
```bash
# Check if ingress controller is running
kubectl get pods -n ingress-nginx

# Check ingress events
kubectl describe ingress book-manager-ingress -n book-manager

# For Minikube
minikube tunnel  # Run in another terminal
```

### Issue: Ingress IP not assigning

**Solution:**
```bash
# Check service type
kubectl get svc -n ingress-nginx

# Manually assign LoadBalancer IP (if supported by your cluster)
kubectl patch svc nginx-ingress-ingress-nginx-controller \
  -p '{"spec":{"type":"LoadBalancer"}}' \
  -n ingress-nginx
```

---

## Next Steps

1. **Monitoring**: Set up Prometheus and Grafana
2. **Logging**: Deploy ELK Stack or similar
3. **CI/CD**: Set up GitOps with ArgoCD or Flux
4. **Backup**: Implement backup strategy for database
5. **Scaling**: Configure HPA and VPA for auto-scaling
6. **Security**: Implement network policies and RBAC

---

## Useful Resources

- **Kubernetes Documentation**: https://kubernetes.io/docs/
- **Kubectl Cheat Sheet**: https://kubernetes.io/docs/reference/kubectl/cheatsheet/
- **Kubernetes Best Practices**: https://kubernetes.io/docs/concepts/configuration/overview/
- **Security Best Practices**: https://kubernetes.io/docs/concepts/security/

---

**Last Updated**: October 4, 2026
**Version**: 1.0
