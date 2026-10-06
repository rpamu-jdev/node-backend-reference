# MERN Stack Book Manager - Kubernetes Deployment Guide

## Overview

This guide explains how to deploy the MERN Stack Book Manager application on Kubernetes. The application consists of:
- **Frontend**: React + Vite running on port 5173
- **Backend**: Node.js + Express running on port 8443
- **Database**: PostgreSQL running on port 5432

---

## Prerequisites

- Kubernetes cluster (v1.20+)
- kubectl configured to access your cluster
- Docker images pushed to a container registry (Docker Hub, ECR, GCR, etc.)
- Ingress controller installed (nginx-ingress or similar)
- PersistentVolume support (optional, for database persistence)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Internet / Load Balancer                 │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    ┌───▼────┐      ┌────▼───┐      ┌───▼────┐
    │Ingress │      │Ingress │      │Ingress │
    │Host    │      │Host    │      │Host    │
    │www.xxx │      │api.xxx │      │db.xxx  │
    └───┬────┘      └────┬───┘      └────────┘
        │                │
    ┌───▼──────────┐ ┌───▼──────────┐
    │Frontend Svc  │ │Backend Svc   │
    │Port 5173     │ │Port 8443     │
    └───┬──────────┘ └───┬──────────┘
        │                │
    ┌───▼──────────┐ ┌───▼──────────┐
    │Frontend Pod  │ │Backend Pod   │
    │React App     │ │Express API   │
    └──────────────┘ └───┬──────────┘
                         │
                    ┌────▼──────────┐
                    │Database Pod   │
                    │PostgreSQL     │
                    │Port 5432      │
                    └───────────────┘
```

---

## Deployment Steps

### Step 1: Build and Push Docker Images

```bash
# Build backend image
docker build -t your-registry/book-manager-backend:latest ./node-backend-reference
docker push your-registry/book-manager-backend:latest

# Build frontend image
docker build -t your-registry/book-manager-frontend:latest ./book-app-frontend
docker push your-registry/book-manager-frontend:latest
```

### Step 2: Create Kubernetes Namespace

```bash
kubectl create namespace book-manager
```

### Step 3: Create ConfigMap for Frontend Environment

```bash
kubectl create configmap frontend-config \
  --from-literal=VITE_API_URL=https://api.yourdomain.com/api \
  -n book-manager
```

### Step 4: Create Secret for Backend Environment

```bash
kubectl create secret generic backend-secret \
  --from-literal=DB_NAME=extio_learn_db \
  --from-literal=DB_USER=postgres \
  --from-literal=DB_PASS=your-secure-password \
  --from-literal=JWT_SECRET=your-super-secret-jwt-key \
  -n book-manager
```

### Step 5: Apply Database Deployment

```bash
kubectl apply -f k8s/postgres-pvc.yaml -n book-manager
kubectl apply -f k8s/postgres-deployment.yaml -n book-manager
kubectl apply -f k8s/postgres-service.yaml -n book-manager
```

Wait for PostgreSQL to be ready:
```bash
kubectl wait --for=condition=ready pod -l app=postgres -n book-manager --timeout=300s
```

### Step 6: Apply Backend Deployment

```bash
kubectl apply -f k8s/backend-deployment.yaml -n book-manager
kubectl apply -f k8s/backend-service.yaml -n book-manager
```

### Step 7: Apply Frontend Deployment

```bash
kubectl apply -f k8s/frontend-deployment.yaml -n book-manager
kubectl apply -f k8s/frontend-service.yaml -n book-manager
```

### Step 8: Apply Ingress Configuration

```bash
kubectl apply -f k8s/ingress.yaml -n book-manager
```

### Step 9: Verify Deployment

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

## Accessing the Application

### Update DNS Records

Once you have the Ingress IP/Hostname, update your DNS records:

```
A Record:
  www.yourdomain.com  → [INGRESS_IP]
  api.yourdomain.com  → [INGRESS_IP]

Or using CNAME:
  www.yourdomain.com  → [INGRESS_HOSTNAME]
  api.yourdomain.com  → [INGRESS_HOSTNAME]
```

### Access URLs

- **Frontend**: `https://www.yourdomain.com`
- **Backend API**: `https://api.yourdomain.com/api`
- **Login**: `https://www.yourdomain.com` (Username: admin, Password: password)

---

## File Structure

```
k8s/
├── postgres-pvc.yaml          # PersistentVolumeClaim for database
├── postgres-deployment.yaml    # PostgreSQL Deployment
├── postgres-service.yaml       # PostgreSQL Service (ClusterIP)
├── backend-deployment.yaml     # Express API Deployment
├── backend-service.yaml        # Backend Service (ClusterIP)
├── frontend-deployment.yaml    # React Frontend Deployment
├── frontend-service.yaml       # Frontend Service (ClusterIP)
├── ingress.yaml               # Ingress for routing
└── namespace.yaml             # Kubernetes namespace
```

---

## Environment Variables

### Backend Environment Variables

```env
DB_NAME=extio_learn_db
DB_USER=postgres
DB_PASS=your-secure-password
DB_HOST=postgres-service
DB_PORT=5432
PORT=8443
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
```

### Frontend Environment Variables

```env
VITE_API_URL=https://api.yourdomain.com/api
```

---

## Scaling

### Scale Backend Replicas

```bash
kubectl scale deployment/backend --replicas=3 -n book-manager
```

### Scale Frontend Replicas

```bash
kubectl scale deployment/frontend --replicas=2 -n book-manager
```

---

## Monitoring and Logs

### View Logs

```bash
# Backend logs
kubectl logs -l app=backend -n book-manager -f

# Frontend logs
kubectl logs -l app=frontend -n book-manager -f

# Database logs
kubectl logs -l app=postgres -n book-manager -f
```

### Port Forward for Debugging

```bash
# Forward backend
kubectl port-forward svc/backend-service 8443:8443 -n book-manager

# Forward database
kubectl port-forward svc/postgres-service 5432:5432 -n book-manager
```

---

## SSL/TLS Certificate (Optional)

### Using Let's Encrypt with cert-manager

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Apply certificate issuer
kubectl apply -f k8s/cert-issuer.yaml -n book-manager
```

Update ingress.yaml to include TLS:

```yaml
spec:
  tls:
  - hosts:
    - www.yourdomain.com
    - api.yourdomain.com
    secretName: book-manager-tls
  rules:
  - host: www.yourdomain.com
    http:
      paths:
      - path: /
        backend:
          serviceName: frontend-service
          servicePort: 5173
```

---

## Updating the Application

### Update Backend Image

```bash
# Update image in deployment
kubectl set image deployment/backend \
  backend=your-registry/book-manager-backend:v2.0 \
  -n book-manager

# Check rollout status
kubectl rollout status deployment/backend -n book-manager
```

### Update Frontend Image

```bash
# Update image in deployment
kubectl set image deployment/frontend \
  frontend=your-registry/book-manager-frontend:v2.0 \
  -n book-manager

# Check rollout status
kubectl rollout status deployment/frontend -n book-manager
```

---

## Troubleshooting

### Pod Won't Start

```bash
# Check pod status
kubectl describe pod <pod-name> -n book-manager

# Check events
kubectl get events -n book-manager --sort-by='.lastTimestamp'
```

### Backend Can't Connect to Database

```bash
# Verify database service
kubectl get svc postgres-service -n book-manager

# Test connection from backend pod
kubectl exec -it <backend-pod> -n book-manager -- \
  nc -zv postgres-service 5432
```

### Frontend Can't Reach Backend API

```bash
# Check API URL in frontend ConfigMap
kubectl get configmap frontend-config -o yaml -n book-manager

# Verify ingress routing
kubectl get ingress -n book-manager -o yaml
```

### Database Data Not Persisting

```bash
# Check PVC
kubectl get pvc -n book-manager

# Check PV
kubectl get pv
```

---

## Cleanup

### Remove All Resources

```bash
# Delete namespace (removes all resources in it)
kubectl delete namespace book-manager

# Or delete individual resources
kubectl delete deployment,service,ingress,pvc -l app=book-manager -n book-manager
```

---

## Best Practices

1. **Use Secrets** for sensitive data (passwords, API keys)
2. **Use ConfigMaps** for non-sensitive configuration
3. **Set Resource Limits** to prevent resource exhaustion
4. **Use Health Checks** (liveness and readiness probes)
5. **Enable Horizontal Pod Autoscaling** for production
6. **Use Network Policies** to restrict traffic
7. **Enable RBAC** for access control
8. **Use PersistentVolumes** for database data
9. **Implement Backup Strategy** for database
10. **Monitor Logs** with ELK stack or similar

---

## Production Checklist

- [ ] Update Docker image registry URLs
- [ ] Set secure database password
- [ ] Set secure JWT secret
- [ ] Configure domain name and DNS
- [ ] Set up SSL/TLS certificates
- [ ] Configure ingress controller
- [ ] Set resource limits and requests
- [ ] Set up monitoring and alerting
- [ ] Configure backup strategy
- [ ] Set up log aggregation
- [ ] Test application deployment
- [ ] Document scaling procedures
- [ ] Set up CI/CD pipeline

---

## Support

For issues or questions:
1. Check Kubernetes documentation: https://kubernetes.io/docs/
2. Check application logs: `kubectl logs -l app=backend -n book-manager`
3. Check events: `kubectl get events -n book-manager`
4. Review deployment manifests for misconfigurations

---

**Last Updated**: October 4, 2026
**Version**: 1.0
