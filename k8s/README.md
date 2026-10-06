# Kubernetes Deployment Files

Complete Kubernetes deployment configuration for the MERN Stack Book Manager application.

## 📁 Files Overview

### Configuration Files

| File | Purpose |
|------|---------|
| `namespace.yaml` | Kubernetes namespace for the application |
| `postgres-pvc.yaml` | Persistent volume claim for database storage |
| `postgres-deployment.yaml` | PostgreSQL 16 database deployment |
| `postgres-service.yaml` | Database service (ClusterIP) |
| `backend-deployment.yaml` | Node.js Express API deployment |
| `backend-service.yaml` | Backend service (ClusterIP) |
| `frontend-deployment.yaml` | React Vite frontend deployment |
| `frontend-service.yaml` | Frontend service (ClusterIP) |
| `ingress.yaml` | Ingress controller configuration for routing |
| `cert-issuer.yaml` | Let's Encrypt certificate issuers (SSL/TLS) |
| `hpa.yaml` | Horizontal Pod Autoscaler for auto-scaling |

### Documentation

| File | Purpose |
|------|---------|
| `SETUP_INSTRUCTIONS.md` | Step-by-step setup guide |
| `QUICK_REFERENCE.md` | Common kubectl commands |
| `deploy.sh` | Automated deployment script |
| `README.md` | This file |

---

## 🚀 Quick Start

### 1. Prerequisites

```bash
# Check kubectl installation
kubectl version --client

# Check cluster connectivity
kubectl cluster-info
```

### 2. Deploy Application

**Automated (Recommended):**
```bash
# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

**Manual:**
```bash
kubectl apply -f namespace.yaml
kubectl create secret generic backend-secret \
  --from-literal=DB_NAME=extio_learn_db \
  --from-literal=DB_USER=postgres \
  --from-literal=DB_PASS="your-password" \
  --from-literal=JWT_SECRET="your-secret" \
  -n book-manager
kubectl create configmap frontend-config \
  --from-literal=VITE_API_URL=https://api.yourdomain.com/api \
  -n book-manager
kubectl apply -f postgres-*.yaml -n book-manager
kubectl apply -f backend-*.yaml -n book-manager
kubectl apply -f frontend-*.yaml -n book-manager
kubectl apply -f ingress.yaml -n book-manager
```

### 3. Verify Deployment

```bash
kubectl get all -n book-manager
kubectl get ingress -n book-manager -o wide
```

### 4. Access Application

- **Frontend**: `https://www.yourdomain.com`
- **Backend API**: `https://api.yourdomain.com/api`

---

## 🔧 Configuration

### Update Image References

Before deploying, update the container image paths in the deployment files:

```bash
# In backend-deployment.yaml
image: your-registry/book-manager-backend:latest

# In frontend-deployment.yaml
image: your-registry/book-manager-frontend:latest
```

### Update Domain

Update your domain in:

```bash
# In ingress.yaml
- host: www.yourdomain.com
- host: api.yourdomain.com

# In frontend ConfigMap
VITE_API_URL=https://api.yourdomain.com/api

# In cert-issuer.yaml
email: your-email@yourdomain.com
```

---

## 🔐 Secrets Management

### Create Backend Secret

```bash
kubectl create secret generic backend-secret \
  --from-literal=DB_NAME=extio_learn_db \
  --from-literal=DB_USER=postgres \
  --from-literal=DB_PASS="your-secure-password" \
  --from-literal=JWT_SECRET="your-super-secret-jwt-key" \
  -n book-manager
```

### Create Frontend ConfigMap

```bash
kubectl create configmap frontend-config \
  --from-literal=VITE_API_URL=https://api.yourdomain.com/api \
  -n book-manager
```

### Update Secrets

```bash
# Delete and recreate (not recommended for production)
kubectl delete secret backend-secret -n book-manager
kubectl create secret generic backend-secret \
  --from-literal=DB_NAME=extio_learn_db \
  --from-literal=DB_USER=postgres \
  --from-literal=DB_PASS="new-password" \
  --from-literal=JWT_SECRET="new-secret" \
  -n book-manager
```

---

## 📊 Scaling

### Manual Scaling

```bash
# Scale backend to 5 replicas
kubectl scale deployment/backend --replicas=5 -n book-manager

# Scale frontend to 3 replicas
kubectl scale deployment/frontend --replicas=3 -n book-manager
```

### Automatic Scaling (HPA)

Deploy HPA for automatic scaling based on CPU/Memory:

```bash
kubectl apply -f hpa.yaml -n book-manager

# View HPA status
kubectl get hpa -n book-manager
kubectl top pods -n book-manager
```

---

## 🔍 Monitoring and Debugging

### View Logs

```bash
# Backend logs
kubectl logs -l app=backend -n book-manager -f

# Frontend logs
kubectl logs -l app=frontend -n book-manager -f

# Database logs
kubectl logs -l app=postgres -n book-manager -f
```

### Port Forward for Local Testing

```bash
# Backend
kubectl port-forward svc/backend-service 8443:8443 -n book-manager

# Database
kubectl port-forward svc/postgres-service 5432:5432 -n book-manager

# Frontend
kubectl port-forward svc/frontend-service 5173:5173 -n book-manager
```

### Check Pod Status

```bash
# Detailed pod information
kubectl describe pod <pod-name> -n book-manager

# Check pod events
kubectl get events -n book-manager

# View pod readiness and liveness probes
kubectl get pods -n book-manager -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.conditions[*].message}{"\n"}{end}'
```

---

## 🔄 Rolling Updates

### Update Container Image

```bash
# Update backend
kubectl set image deployment/backend \
  backend=your-registry/book-manager-backend:v2.0 \
  -n book-manager

# Check rollout status
kubectl rollout status deployment/backend -n book-manager

# Rollback if needed
kubectl rollout undo deployment/backend -n book-manager
```

---

## 🛡️ SSL/TLS Configuration

### With Let's Encrypt (cert-manager)

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Apply certificate issuers
kubectl apply -f cert-issuer.yaml

# Update ingress.yaml with TLS configuration (uncomment)
kubectl apply -f ingress.yaml -n book-manager
```

### Manual SSL Certificate

If using existing certificate, create a TLS secret:

```bash
kubectl create secret tls book-manager-tls \
  --cert=path/to/tls.crt \
  --key=path/to/tls.key \
  -n book-manager
```

Then update ingress.yaml:
```yaml
tls:
- hosts:
  - www.yourdomain.com
  - api.yourdomain.com
  secretName: book-manager-tls
```

---

## 🗑️ Cleanup

### Delete Specific Resource

```bash
# Delete a deployment
kubectl delete deployment backend -n book-manager

# Delete a service
kubectl delete svc backend-service -n book-manager
```

### Delete All Resources

```bash
# Delete namespace (removes all resources in it)
kubectl delete namespace book-manager

# Delete individual resources
kubectl delete all --all -n book-manager
```

---

## 📈 Production Checklist

- [ ] Update Docker image registry URLs
- [ ] Set secure database password (generate random)
- [ ] Set secure JWT secret (generate random)
- [ ] Configure domain name and DNS records
- [ ] Set up SSL/TLS certificates with cert-manager
- [ ] Configure ingress controller for your cloud provider
- [ ] Set resource limits and requests for all containers
- [ ] Enable HPA for auto-scaling
- [ ] Set up monitoring (Prometheus + Grafana)
- [ ] Set up logging (ELK Stack or similar)
- [ ] Configure backup strategy for database
- [ ] Set up network policies for security
- [ ] Enable RBAC for access control
- [ ] Test disaster recovery procedures
- [ ] Document operational runbooks

---

## 🐛 Troubleshooting

### Pods won't start

```bash
kubectl describe pod <pod-name> -n book-manager
kubectl logs <pod-name> -n book-manager
```

### Can't connect to database

```bash
kubectl exec -it <backend-pod> -n book-manager -- \
  nc -zv postgres-service 5432
```

### Ingress shows pending

```bash
kubectl get ingress -n book-manager -o wide
kubectl describe ingress book-manager-ingress -n book-manager
```

### Services not resolving

```bash
kubectl exec -it <pod-name> -n book-manager -- \
  nslookup backend-service
```

---

## 📚 Resources

- **Main Deployment Guide**: [../KUBERNETES_DEPLOYMENT.md](../KUBERNETES_DEPLOYMENT.md)
- **Setup Instructions**: [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)
- **Quick Reference**: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- **Kubernetes Docs**: https://kubernetes.io/docs/
- **kubectl Cheatsheet**: https://kubernetes.io/docs/reference/kubectl/cheatsheet/

---

## 💡 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Internet / LoadBalancer               │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
    ┌────▼──────┐          ┌────▼──────┐
    │Ingress    │          │Ingress    │
    │www.xxx    │          │api.xxx    │
    └────┬──────┘          └────┬──────┘
         │                      │
    ┌────▼──────────┐      ┌────▼─────────┐
    │Frontend Svc   │      │Backend Svc   │
    │Port 5173      │      │Port 8443     │
    └────┬──────────┘      └────┬─────────┘
         │                      │
    ┌────▼──────────┐      ┌────▼─────────┐
    │Frontend Pod(s)│      │Backend Pod(s)│
    │React + Vite   │      │Express API   │
    └───────────────┘      └────┬─────────┘
                                │
                           ┌────▼──────────┐
                           │Database Svc   │
                           │Port 5432      │
                           └────┬──────────┘
                                │
                           ┌────▼──────────┐
                           │PostgreSQL Pod │
                           │+ PVC Storage  │
                           └───────────────┘
```

---

## 📝 Version Info

- **Kubernetes**: 1.20+
- **PostgreSQL**: 16-alpine
- **Node.js**: See backend Dockerfile
- **React**: See frontend Dockerfile
- **Last Updated**: October 4, 2026
- **Version**: 1.0

---

**For detailed setup instructions, see [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)**

**For common commands, see [QUICK_REFERENCE.md](QUICK_REFERENCE.md)**
