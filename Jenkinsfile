pipeline {
    agent any

    environment {
        DB_HOST = 'localhost'
        DB_NAME = 'inventory_db'
        DB_PORT = '3306'
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
                    bat 'docker build -t inventory-management:latest .'
                }
            }
        }
    }
}