#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Configuration
NAMESPACE="book-manager"
REGISTRY="${DOCKER_REGISTRY:-your-registry}"
BACKEND_IMAGE="${REGISTRY}/book-manager-backend:latest"
FRONTEND_IMAGE="${REGISTRY}/book-manager-frontend:latest"
DOMAIN="${DOMAIN:-yourdomain.com}"
EMAIL="${EMAIL:-your-email@yourdomain.com}"

# Function to check if kubectl is installed
check_kubectl() {
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl is not installed"
        exit 1
    fi
    print_success "kubectl found"
}

# Function to check cluster connectivity
check_cluster() {
    if ! kubectl cluster-info &> /dev/null; then
        print_error "Cannot connect to Kubernetes cluster"
        exit 1
    fi
    print_success "Connected to Kubernetes cluster"
}

# Function to create namespace
create_namespace() {
    print_info "Creating namespace: $NAMESPACE"
    kubectl apply -f namespace.yaml
    print_success "Namespace created"
}

# Function to create secrets
create_secrets() {
    print_info "Creating secrets..."

    # Check if secret already exists
    if kubectl get secret backend-secret -n $NAMESPACE &> /dev/null; then
        print_warning "Secret 'backend-secret' already exists, skipping..."
    else
        read -sp "Enter database password: " DB_PASS
        echo
        read -sp "Enter JWT secret: " JWT_SECRET
        echo

        kubectl create secret generic backend-secret \
            --from-literal=DB_NAME=extio_learn_db \
            --from-literal=DB_USER=postgres \
            --from-literal=DB_PASS="$DB_PASS" \
            --from-literal=JWT_SECRET="$JWT_SECRET" \
            -n $NAMESPACE

        print_success "Secrets created"
    fi
}

# Function to create configmaps
create_configmaps() {
    print_info "Creating ConfigMaps..."

    if kubectl get configmap frontend-config -n $NAMESPACE &> /dev/null; then
        print_warning "ConfigMap 'frontend-config' already exists, skipping..."
    else
        kubectl create configmap frontend-config \
            --from-literal=VITE_API_URL=https://api.$DOMAIN/api \
            -n $NAMESPACE

        print_success "ConfigMaps created"
    fi
}

# Function to update image references
update_images() {
    print_info "Updating image references..."

    # Update backend image
    sed -i "s|your-registry/book-manager-backend:latest|$BACKEND_IMAGE|g" backend-deployment.yaml

    # Update frontend image
    sed -i "s|your-registry/book-manager-frontend:latest|$FRONTEND_IMAGE|g" frontend-deployment.yaml

    # Update ingress domain
    sed -i "s|www\.yourdomain\.com|www.$DOMAIN|g" ingress.yaml
    sed -i "s|api\.yourdomain\.com|api.$DOMAIN|g" ingress.yaml

    # Update cert-issuer email
    sed -i "s|your-email@yourdomain\.com|$EMAIL|g" cert-issuer.yaml

    print_success "Image references updated"
}

# Function to deploy PostgreSQL
deploy_postgres() {
    print_info "Deploying PostgreSQL..."

    kubectl apply -f postgres-pvc.yaml
    kubectl apply -f postgres-deployment.yaml
    kubectl apply -f postgres-service.yaml

    print_info "Waiting for PostgreSQL to be ready..."
    kubectl wait --for=condition=ready pod -l app=postgres -n $NAMESPACE --timeout=300s

    print_success "PostgreSQL deployed"
}

# Function to deploy Backend
deploy_backend() {
    print_info "Deploying Backend..."

    kubectl apply -f backend-deployment.yaml
    kubectl apply -f backend-service.yaml

    print_info "Waiting for Backend to be ready..."
    kubectl wait --for=condition=ready pod -l app=backend -n $NAMESPACE --timeout=300s

    print_success "Backend deployed"
}

# Function to deploy Frontend
deploy_frontend() {
    print_info "Deploying Frontend..."

    kubectl apply -f frontend-deployment.yaml
    kubectl apply -f frontend-service.yaml

    print_info "Waiting for Frontend to be ready..."
    kubectl wait --for=condition=ready pod -l app=frontend -n $NAMESPACE --timeout=300s

    print_success "Frontend deployed"
}

# Function to deploy Ingress
deploy_ingress() {
    print_info "Deploying Ingress..."

    kubectl apply -f ingress.yaml

    print_success "Ingress deployed"
}

# Function to display access information
show_access_info() {
    print_info "Getting Ingress information..."

    sleep 5

    INGRESS_IP=$(kubectl get ingress book-manager-ingress -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "PENDING")
    INGRESS_HOST=$(kubectl get ingress book-manager-ingress -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || echo "PENDING")

    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  Deployment Complete!${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${BLUE}Ingress Information:${NC}"
    echo "  IP Address: $INGRESS_IP"
    echo "  Hostname: $INGRESS_HOST"
    echo ""
    echo -e "${BLUE}Access URLs:${NC}"
    echo "  Frontend: https://www.$DOMAIN"
    echo "  Backend API: https://api.$DOMAIN/api"
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo "  1. Update your DNS records:"
    echo "     www.$DOMAIN  → $INGRESS_IP (or $INGRESS_HOST)"
    echo "     api.$DOMAIN  → $INGRESS_IP (or $INGRESS_HOST)"
    echo ""
    echo "  2. Check pod status:"
    echo "     kubectl get pods -n $NAMESPACE"
    echo ""
    echo "  3. View logs:"
    echo "     kubectl logs -l app=backend -n $NAMESPACE -f"
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
}

# Main deployment flow
main() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  Book Manager - Kubernetes Deployment Script             ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""

    print_info "Configuration:"
    echo "  Namespace: $NAMESPACE"
    echo "  Backend Image: $BACKEND_IMAGE"
    echo "  Frontend Image: $FRONTEND_IMAGE"
    echo "  Domain: $DOMAIN"
    echo ""

    # Pre-flight checks
    print_info "Running pre-flight checks..."
    check_kubectl
    check_cluster
    echo ""

    # Deployment steps
    create_namespace
    create_secrets
    create_configmaps
    update_images
    deploy_postgres
    deploy_backend
    deploy_frontend
    deploy_ingress

    # Show access information
    echo ""
    show_access_info
}

# Run main function
main
