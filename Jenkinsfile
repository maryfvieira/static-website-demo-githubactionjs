pipeline {
  agent any

  environment {
    S3_BUCKET          = 'my-static-website-for-jenkins'
    AWS_DEFAULT_REGION = 'sa-east-1'
    GIT_BRANCH         = 'main'
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: "${GIT_BRANCH}",
            url: 'https://github.com/maryfvieira/static-website-demo-githubactionjs.git',
            credentialsId: 'github'
      }
    }

    stage('Install, Test, Build') {
      steps {
        sh '''
          echo "📦 Instalando dependências..."
          node -v
          npm ci || npm install
          
          echo "🔎 Rodando lint..."
          npm run lint
          
          echo "🧪 Rodando testes..."
          npm run test
          
          echo "🏗️ Fazendo build..."
          npm run build
        '''
      }
    }

    stage('Deploy to S3') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'aws-creds',
                          usernameVariable: 'AWS_ACCESS_KEY_ID',
                          passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
          sh '''
            echo "☁️  Publicando no S3..."
            aws s3 sync dist s3://$S3_BUCKET --delete
          '''
        }
      }
    }
  }

  post {
    success {
      echo '✅ Deploy concluído.'
    }
    failure {
      echo '❌ Falhou. Veja os logs dos stages.'
    }
  }
}
