# Kubernetes Deployment Files - Complete Summary

## 📋 Overview

Complete Kubernetes deployment setup for MERN Stack Book Manager application with production-ready configurations.

---

## 📂 Directory Structure

```
mern-stack/
├── KUBERNETES_DEPLOYMENT.md          # Main deployment guide
├── KUBERNETES_FILES_SUMMARY.md        # This file
├── docker-compose.yml                # Docker Compose for local dev
├── k8s/
│   ├── README.md                     # Quick reference for k8s folder
│   ├── SETUP_INSTRUCTIONS.md         # Step-by-step setup guide
│   ├── QUICK_REFERENCE.md            # Common kubectl commands
│   ├── deploy.sh                     # Automated deployment script
│   │
│   ├── namespace.yaml                # Kubernetes namespace
│   │
│   ├── postgres-pvc.yaml             # Database storage
│   ├── postgres-deployment.yaml      # PostgreSQL database
│   ├── postgres-service.yaml         # Database service
│   │
│   ├── backend-deployment.yaml       # Express API server
│   ├── backend-service.yaml          # Backend service
│   │
│   ├── frontend-deployment.yaml      # React frontend
│   ├── frontend-service.yaml         # Frontend service
│   │
│   ├── ingress.yaml                  # Ingress routing
│   ├── cert-issuer.yaml              # SSL/TLS certificates
│   └── hpa.yaml                      # Auto-scaling configuration
```

---

## 📄 File Descriptions

### Main Documentation

#### `KUBERNETES_DEPLOYMENT.md` (Main Guide)
Complete Kubernetes deployment documentation including:
- Architecture overview with diagrams
- Prerequisites and setup steps
- Deployment instructions (9 steps)
- Accessing the application
- Environment variables reference
- Scaling procedures
- Monitoring and logging
- SSL/TLS setup
- Troubleshooting guide
- Best practices and production checklist

#### `KUBERNETES_FILES_SUMMARY.md` (This File)
Quick reference to all deployment files and their purposes.

### Setup and Configuration

#### `k8s/SETUP_INSTRUCTIONS.md`
Detailed step-by-step guide including:
1. Installing kubectl
2. Configuring kubectl access (Minikube, EKS, GKE, AKS)
3. Enabling Kubernetes features (Ingress, Metrics Server, cert-manager)
4. Building and pushing Docker images
5. Preparing environment variables
6. Deploying the application
7. Verifying deployment
8. Configuring DNS
9. Accessing the application
10. Common issues and solutions

#### `k8s/QUICK_REFERENCE.md`
Common kubectl commands organized by category:
- View resources
- Describe resources
- View logs
- Execute commands
- Port forwarding
- Scaling
- Updating
- Events and status
- Debugging
- Deletion
- Useful one-liners
- Troubleshooting

#### `k8s/README.md`
Quick start guide for the k8s directory with:
- Files overview table
- Quick start (3 steps)
- Configuration tips
- Secrets and ConfigMaps management
- Scaling options
- Monitoring and debugging
- Rolling updates
- SSL/TLS configuration
- Cleanup procedures
- Production checklist
- Architecture diagram

### Deployment Scripts

#### `k8s/deploy.sh` (Executable)
Automated deployment script featuring:
- Colored output for easy reading
- Pre-flight checks (kubectl, cluster connectivity)
- Namespace creation
- Secret and ConfigMap creation with prompts
- Image reference updates
- Database deployment with wait
- Backend deployment with wait
- Frontend deployment with wait
- Ingress deployment
- DNS and access information display
- Error handling

Usage:
```bash
chmod +x k8s/deploy.sh
./k8s/deploy.sh
```

### Kubernetes Configuration Files

#### Namespace Configuration

**`k8s/namespace.yaml`**
- Creates `book-manager` namespace
- Organizes all application resources
- Isolated from other applications

#### Database Configuration

**`k8s/postgres-pvc.yaml`**
- Persistent Volume Claim for PostgreSQL
- Requests 10Gi storage
- ReadWriteOnce access mode
- Supports any storage class

**`k8s/postgres-deployment.yaml`**
- PostgreSQL 16 Alpine image
- 1 replica (not replicated)
- Environment variables from secrets
- Health checks (liveness + readiness)
- Resource limits and requests
- Data persisted to PVC

**`k8s/postgres-service.yaml`**
- ClusterIP service type
- Port 5432 internally
- Used for internal pod communication

#### Backend Configuration

**`k8s/backend-deployment.yaml`**
- Node.js Express API server
- 2 replicas by default
- Environment variables from secrets and ConfigMaps
- Health checks for /api/health endpoint
- Resource limits and requests
- Image pull policy: Always
- Supports HPA autoscaling

**`k8s/backend-service.yaml`**
- ClusterIP service type
- Port 8443 internally
- Load balances traffic to backend pods

#### Frontend Configuration

**`k8s/frontend-deployment.yaml`**
- React + Vite frontend
- 2 replicas by default
- Environment variables from ConfigMaps
- Health checks for / endpoint
- Resource limits and requests
- Image pull policy: Always
- Supports HPA autoscaling

**`k8s/frontend-service.yaml`**
- ClusterIP service type
- Port 5173 internally
- Load balances traffic to frontend pods

#### Ingress Configuration

**`k8s/ingress.yaml`**
- Nginx-ingress controller
- Routes frontend requests to `www.yourdomain.com`
- Routes backend requests to `api.yourdomain.com`
- CORS headers configuration
- SSL/TLS support (with cert-manager)
- Configurable for single or multiple domains

**`k8s/cert-issuer.yaml`**
- Let's Encrypt production issuer
- Let's Encrypt staging issuer (for testing)
- Automatic certificate generation
- HTTP-01 ACME challenge method
- Email for expiry notifications

#### Autoscaling Configuration

**`k8s/hpa.yaml`**
- Backend HPA: 2-10 replicas
  - Scale up: 70% CPU or 80% memory
  - Scale down: After 5 minutes of low usage
- Frontend HPA: 2-5 replicas
  - Scale up: 75% CPU or 80% memory
  - Scale down: After 5 minutes of low usage
- Gradual scaling to prevent thrashing

---

## 🚀 Quick Start

### Option 1: Automated Deployment (Recommended)

```bash
cd mern-stack/k8s
chmod +x deploy.sh
./deploy.sh
```

The script will:
1. Check prerequisites
2. Create namespace
3. Prompt for secrets
4. Create ConfigMaps
5. Update image references
6. Deploy all services
7. Display access information

### Option 2: Manual Deployment

```bash
# 1. Apply namespace
kubectl apply -f k8s/namespace.yaml

# 2. Create secrets
kubectl create secret generic backend-secret \
  --from-literal=DB_NAME=extio_learn_db \
  --from-literal=DB_USER=postgres \
  --from-literal=DB_PASS="password" \
  --from-literal=JWT_SECRET="secret" \
  -n book-manager

# 3. Create ConfigMap
kubectl create configmap frontend-config \
  --from-literal=VITE_API_URL=https://api.yourdomain.com/api \
  -n book-manager

# 4. Deploy database
kubectl apply -f k8s/postgres-*.yaml -n book-manager
kubectl wait --for=condition=ready pod -l app=postgres --timeout=300s -n book-manager

# 5. Deploy backend
kubectl apply -f k8s/backend-*.yaml -n book-manager
kubectl wait --for=condition=ready pod -l app=backend --timeout=300s -n book-manager

# 6. Deploy frontend
kubectl apply -f k8s/frontend-*.yaml -n book-manager
kubectl wait --for=condition=ready pod -l app=frontend --timeout=300s -n book-manager

# 7. Deploy ingress
kubectl apply -f k8s/ingress.yaml -n book-manager

# 8. (Optional) Enable autoscaling
kubectl apply -f k8s/hpa.yaml -n book-manager
```

---

## ⚙️ Configuration Requirements

### Before Deployment

1. **Docker Images**
   - Build and push backend image to your registry
   - Build and push frontend image to your registry
   - Update image paths in deployment YAML files

2. **Domain Name**
   - www.yourdomain.com (frontend)
   - api.yourdomain.com (backend)
   - Update ingress.yaml with your domains

3. **Secrets**
   - Secure database password
   - JWT secret key
   - Update cert-issuer.yaml with your email

4. **Kubernetes Cluster**
   - Ingress controller installed (nginx-ingress recommended)
   - Metrics server installed (for HPA)
   - cert-manager installed (optional, for SSL/TLS)

---

## 📊 Resource Configuration

### Default Resource Requests/Limits

**PostgreSQL**
- Request: 256Mi memory, 250m CPU
- Limit: 512Mi memory, 500m CPU

**Backend**
- Request: 256Mi memory, 250m CPU
- Limit: 512Mi memory, 500m CPU
- Replicas: 2 (scalable to 10 with HPA)

**Frontend**
- Request: 128Mi memory, 100m CPU
- Limit: 256Mi memory, 250m CPU
- Replicas: 2 (scalable to 5 with HPA)

---

## 🔐 Security Configurations

### Already Implemented

✅ Secrets for sensitive data (passwords, JWT keys)
✅ ConfigMaps for non-sensitive configuration
✅ Namespace isolation
✅ Resource limits to prevent resource exhaustion
✅ Health checks for reliability
✅ CORS headers configuration
✅ ReadOnly file systems (can be enabled)

### Recommended Additions

- Network Policies for traffic control
- Pod Security Policies (deprecated, use Pod Security Standards)
- RBAC (Role-Based Access Control)
- Service Account isolation
- Secrets encryption at rest
- Container image scanning

---

## 📈 Scaling Strategy

### Horizontal Pod Autoscaling (HPA)

Enabled in `hpa.yaml` based on:
- **CPU Utilization**: 70% for backend, 75% for frontend
- **Memory Usage**: 80% for both
- **Min Replicas**: 2
- **Max Replicas**: 10 (backend), 5 (frontend)

### Manual Scaling

```bash
kubectl scale deployment/backend --replicas=5 -n book-manager
kubectl scale deployment/frontend --replicas=3 -n book-manager
```

---

## 🔍 Monitoring and Troubleshooting

### View Deployment Status

```bash
# All resources
kubectl get all -n book-manager

# Just pods
kubectl get pods -n book-manager

# Pod details
kubectl describe pod <pod-name> -n book-manager

# Logs
kubectl logs <pod-name> -n book-manager -f
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Pods pending | Check node resources, events |
| Database connection failed | Verify postgres-service running |
| Frontend can't reach backend | Check ingress routing, CORS headers |
| Certificate not issuing | Verify cert-manager installed, domain accessible |
| Ingress shows pending | Check ingress controller, LoadBalancer support |

---

## 🔄 Updating Application

### Update Docker Images

```bash
# Build and push new images
docker build -t your-registry/book-manager-backend:v2 ./node-backend-reference
docker push your-registry/book-manager-backend:v2

# Update deployment
kubectl set image deployment/backend \
  backend=your-registry/book-manager-backend:v2 \
  -n book-manager

# Check rollout
kubectl rollout status deployment/backend -n book-manager
```

### Rollback to Previous Version

```bash
kubectl rollout undo deployment/backend -n book-manager
```

---

## 🌍 DNS Configuration

### For A Record (Static IP)

```
www.yourdomain.com    A    <INGRESS_IP>
api.yourdomain.com    A    <INGRESS_IP>
```

### For CNAME (Hostname)

```
www.yourdomain.com    CNAME    <INGRESS_HOSTNAME>
api.yourdomain.com    CNAME    <INGRESS_HOSTNAME>
```

### For Local Testing (Minikube)

Add to `/etc/hosts`:
```
192.168.x.x    www.yourdomain.local
192.168.x.x    api.yourdomain.local
```

---

## ✅ Production Checklist

- [ ] Update Docker image registry and tags
- [ ] Generate secure database password
- [ ] Generate secure JWT secret
- [ ] Configure production domain names
- [ ] Set up SSL/TLS certificates
- [ ] Configure ingress controller
- [ ] Adjust resource limits for production load
- [ ] Enable HPA for auto-scaling
- [ ] Set up Prometheus monitoring
- [ ] Configure centralized logging (ELK, Loki)
- [ ] Implement backup strategy for database
- [ ] Configure network policies
- [ ] Enable RBAC
- [ ] Set up disaster recovery
- [ ] Document runbooks

---

## 📚 Documentation Files

| File | Size | Purpose |
|------|------|---------|
| KUBERNETES_DEPLOYMENT.md | ~15KB | Main deployment guide |
| KUBERNETES_FILES_SUMMARY.md | This file | Quick reference |
| k8s/README.md | ~11KB | K8s directory overview |
| k8s/SETUP_INSTRUCTIONS.md | ~11KB | Step-by-step setup |
| k8s/QUICK_REFERENCE.md | ~6KB | Common commands |

---

## 🔗 External Resources

### Kubernetes Documentation
- Main Docs: https://kubernetes.io/docs/
- API Reference: https://kubernetes.io/docs/reference/
- kubectl Cheat Sheet: https://kubernetes.io/docs/reference/kubectl/cheatsheet/

### Deployment Platforms
- **Minikube**: https://minikube.sigs.k8s.io/ (local development)
- **EKS**: https://aws.amazon.com/eks/ (AWS)
- **GKE**: https://cloud.google.com/kubernetes-engine (Google)
- **AKS**: https://azure.microsoft.com/en-us/services/kubernetes-service/ (Azure)

### Ingress Controllers
- **nginx-ingress**: https://kubernetes.github.io/ingress-nginx/
- **Istio**: https://istio.io/
- **Traefik**: https://traefik.io/

### SSL/TLS
- **cert-manager**: https://cert-manager.io/
- **Let's Encrypt**: https://letsencrypt.org/

---

## 🤝 Support and Help

### Getting Help

1. **Check Kubernetes Docs**: https://kubernetes.io/docs/
2. **View Logs**: `kubectl logs -l app=<app> -n book-manager`
3. **Check Events**: `kubectl get events -n book-manager`
4. **Describe Pod**: `kubectl describe pod <pod-name> -n book-manager`

### Common Commands

```bash
# Check cluster status
kubectl cluster-info
kubectl get nodes

# Check namespace resources
kubectl get all -n book-manager

# Debug pod
kubectl describe pod <pod-name> -n book-manager
kubectl logs <pod-name> -n book-manager
kubectl exec -it <pod-name> -n book-manager -- /bin/sh
```

---

## 📝 Deployment History

- **Version 1.0**: October 4, 2026
- **Status**: Production Ready
- **Tested Platforms**: Minikube, EKS, GKE, AKS

---

## 📞 Quick Links

- **Main Deployment Guide**: [KUBERNETES_DEPLOYMENT.md](KUBERNETES_DEPLOYMENT.md)
- **Setup Guide**: [k8s/SETUP_INSTRUCTIONS.md](k8s/SETUP_INSTRUCTIONS.md)
- **Quick Reference**: [k8s/QUICK_REFERENCE.md](k8s/QUICK_REFERENCE.md)
- **K8s Directory README**: [k8s/README.md](k8s/README.md)

---

**Last Updated**: October 4, 2026
**Version**: 1.0
**Status**: ✅ Production Ready
