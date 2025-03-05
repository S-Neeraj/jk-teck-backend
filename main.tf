provider "aws" {
  region = "us-east-1"
}

# Create an ECR repository for the React app
resource "aws_ecr_repository" "frontend_repo" {
  name = "react-frontend"
}

# Create an ECR repository for the NestJS backend
resource "aws_ecr_repository" "backend_repo" {
  name = "nestjs-backend"
}

# Create an EKS Cluster
module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = "my-eks-cluster"
  cluster_version = "1.27"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  node_groups = {
    frontend_nodes = {
      desired_capacity = 2
      min_size        = 1
      max_size        = 3
      instance_types  = ["t3.medium"]
    }
    backend_nodes = {
      desired_capacity = 2
      min_size        = 1
      max_size        = 3
      instance_types  = ["t3.medium"]
    }
  }
}
