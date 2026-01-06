pipeline {
  agent any
  environment {
    DOCKER_REPO = 'latuss'
    BACKEND_IMAGE = "${DOCKER_REPO}/backend"
    FRONTEND_IMAGE = "${DOCKER_REPO}/frontend"
    TAG = "${BUILD_NUMBER}"
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Build images') {
      steps {
        sh '''
          docker build -t ${BACKEND_IMAGE}:${TAG} backend
          docker build -t ${FRONTEND_IMAGE}:${TAG} frontend
        '''
      }
    }
    stage('Scan (Trivy)') {
      steps {
        sh '''
          trivy image --severity HIGH,CRITICAL --exit-code 0 ${BACKEND_IMAGE}:${TAG} || true
          trivy image --severity HIGH,CRITICAL --exit-code 0 ${FRONTEND_IMAGE}:${TAG} || true
        '''
      }
    }
    stage('Push images') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
          sh '''
            echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
            docker push ${BACKEND_IMAGE}:${TAG}
            docker push ${FRONTEND_IMAGE}:${TAG}
          '''
        }
      }
    }
    stage('Deploy (Ansible)') {
      steps {
        sh '''
          cd ansible
          ansible-galaxy collection install -r collections/requirements.yml
          ansible-playbook -i inventory.ini site.yml --tags infra
          ansible-playbook -i inventory.ini site.yml --tags backend -e backend_image_tag=${TAG}
          ansible-playbook -i inventory.ini site.yml --tags frontend -e frontend_image_tag=${TAG}
        '''
      }
    }
  }
}
