pipeline {
    agent any

    environment {
        DB_HOST = 'localhost'
        DB_NAME = 'inventory_db'
        DB_PORT = '3306'
        IMAGE_NAME = 'ghcr.io/sanjayruban/inventory-management'
    }

    stages {

        stage('Install Dependencies') {
            steps {
                dir('backend') {
                    bat 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'mysql-credentials',
                        usernameVariable: 'DB_USER',
                        passwordVariable: 'DB_PASSWORD'
                    )
                ]) {
                    dir('backend') {
                        bat 'npm test'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('backend') {
                    bat 'docker build -t %IMAGE_NAME%:latest .'
                }
            }
        }

        stage('Push to GHCR') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'ghcr-credentials',
                        usernameVariable: 'GHCR_USER',
                        passwordVariable: 'GHCR_TOKEN'
                    )
                ]) {
                    bat 'echo %GHCR_TOKEN% | docker login ghcr.io -u %GHCR_USER% --password-stdin'
                    bat 'docker push %IMAGE_NAME%:latest'
                    bat 'docker logout ghcr.io'
                }
            }
        }

        stage('Deploy to Render') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'render-deploy-hook',
                        variable: 'RENDER_DEPLOY_HOOK'
                    )
                ]) {
                    bat 'curl -X POST "%RENDER_DEPLOY_HOOK%"'
                }
            }
        }
    }
}