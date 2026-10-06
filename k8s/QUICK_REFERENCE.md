# Kubernetes Quick Reference

## Common kubectl Commands

### View Resources

```bash
# View all pods in namespace
kubectl get pods -n book-manager

# View specific pod
kubectl get pod <pod-name> -n book-manager

# View all services
kubectl get svc -n book-manager

# View all deployments
kubectl get deployment -n book-manager

# View ingress
kubectl get ingress -n book-manager

# View everything
kubectl get all -n book-manager
```

### Describe Resources

```bash
# Detailed information about a pod
kubectl describe pod <pod-name> -n book-manager

# Detailed information about a deployment
kubectl describe deployment <deployment-name> -n book-manager

# Detailed information about a service
kubectl describe svc <service-name> -n book-manager
```

### Logs

```bash
# View logs from a pod
kubectl logs <pod-name> -n book-manager

# Follow logs (like tail -f)
kubectl logs <pod-name> -n book-manager -f

# View logs from all pods with label
kubectl logs -l app=backend -n book-manager -f

# Previous container logs (if pod crashed)
kubectl logs <pod-name> -n book-manager --previous
```

### Execute Commands

```bash
# Execute command in pod
kubectl exec -it <pod-name> -n book-manager -- <command>

# Interactive shell in pod
kubectl exec -it <pod-name> -n book-manager -- /bin/sh

# Example: Test database connection from backend pod
kubectl exec -it <backend-pod> -n book-manager -- nc -zv postgres-service 5432
```

### Port Forwarding

```bash
# Forward backend service
kubectl port-forward svc/backend-service 8443:8443 -n book-manager

# Forward database service
kubectl port-forward svc/postgres-service 5432:5432 -n book-manager

# Forward frontend service
kubectl port-forward svc/frontend-service 5173:5173 -n book-manager
```

### Scale Resources

```bash
# Scale deployment to 3 replicas
kubectl scale deployment/backend --replicas=3 -n book-manager

# Scale frontend to 2 replicas
kubectl scale deployment/frontend --replicas=2 -n book-manager
```

### Update Resources

```bash
# Update image in deployment
kubectl set image deployment/backend \
  backend=your-registry/book-manager-backend:v2.0 \
  -n book-manager

# Check rollout status
kubectl rollout status deployment/backend -n book-manager

# Rollback to previous version
kubectl rollout undo deployment/backend -n book-manager
```

### Events and Status

```bash
# View cluster events
kubectl get events -n book-manager

# Sort events by timestamp
kubectl get events -n book-manager --sort-by='.lastTimestamp'

# Watch events in real-time
kubectl get events -n book-manager --watch
```

### Configuration

```bash
# View ConfigMap
kubectl get configmap frontend-config -o yaml -n book-manager

# View Secret
kubectl get secret backend-secret -o yaml -n book-manager

# Update ConfigMap
kubectl patch configmap frontend-config --type merge \
  -p '{"data":{"VITE_API_URL":"https://new-api.com/api"}}' \
  -n book-manager
```

### Debugging

```bash
# Debug pod with ephemeral container (Kubernetes 1.23+)
kubectl debug <pod-name> -it --image=busybox:1.28 -n book-manager

# Get pod details in JSON
kubectl get pod <pod-name> -o json -n book-manager

# Check pod resource usage
kubectl top pods -n book-manager

# Check node resource usage
kubectl top nodes
```

### Delete Resources

```bash
# Delete a pod
kubectl delete pod <pod-name> -n book-manager

# Delete a deployment
kubectl delete deployment <deployment-name> -n book-manager

# Delete all resources in namespace
kubectl delete all --all -n book-manager

# Delete namespace (removes all resources)
kubectl delete namespace book-manager
```

---

## Useful One-Liners

### Check if all pods are running

```bash
kubectl get pods -n book-manager -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.phase}{"\n"}{end}'
```

### Get backend pod IP address

```bash
kubectl get pods -l app=backend -n book-manager -o wide
```

### Wait for deployment to be ready

```bash
kubectl wait --for=condition=available --timeout=300s deployment/backend -n book-manager
```

### Execute command in all backend pods

```bash
kubectl exec -it $(kubectl get pods -l app=backend -n book-manager -o jsonpath='{.items[0].metadata.name}') -n book-manager -- <command>
```

### View resource requests and limits

```bash
kubectl get pods -n book-manager -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.spec.containers[*].resources}{"\n"}{end}'
```

### Create a backup of Kubernetes objects

```bash
kubectl get all -n book-manager -o yaml > backup.yaml
```

### Check for pod errors

```bash
kubectl get pods -n book-manager -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.containerStatuses[*].state}{"\n"}{end}'
```

---

## Troubleshooting Commands

### Check pod readiness and liveness probes

```bash
kubectl describe pod <pod-name> -n book-manager | grep -A 5 "Conditions:"
```

### Check recent pod events

```bash
kubectl describe pod <pod-name> -n book-manager | tail -20
```

### Verify service endpoints

```bash
kubectl get endpoints -n book-manager
```

### Check ingress status

```bash
kubectl describe ingress book-manager-ingress -n book-manager
```

### View pod resource usage

```bash
kubectl top pod <pod-name> -n book-manager
```

### Check persistent volume claims

```bash
kubectl get pvc -n book-manager
kubectl describe pvc postgres-pvc -n book-manager
```

### Verify DNS resolution in pod

```bash
kubectl exec -it <pod-name> -n book-manager -- nslookup postgres-service
```

---

## Context and Cluster Management

### View current context

```bash
kubectl config current-context
```

### List all contexts

```bash
kubectl config get-contexts
```

### Switch context

```bash
kubectl config use-context <context-name>
```

### View current cluster info

```bash
kubectl cluster-info
```

### View kubeconfig

```bash
kubectl config view
```

---

## Namespace Management

### Create namespace

```bash
kubectl create namespace book-manager
```

### View all namespaces

```bash
kubectl get namespaces
```

### Set default namespace

```bash
kubectl config set-context --current --namespace=book-manager
```

### View resources in all namespaces

```bash
kubectl get pods --all-namespaces
```

---

## Additional Resources

- **Kubernetes Documentation**: https://kubernetes.io/docs/
- **kubectl Cheat Sheet**: https://kubernetes.io/docs/reference/kubectl/cheatsheet/
- **Kubernetes API Reference**: https://kubernetes.io/docs/reference/
