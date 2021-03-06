#!groovy

pipeline {
    agent any
    tools {
        maven 'Maven'
        nodejs 'NodeJS'
    }
    stages {
            stage('Clean') {
                steps {
                dir('edge') {
                    bat "mvn clean"
                }
            }
        }
        
        
            stage('Linting phase') {
                steps {
                dir('edge') {
                     bat "mvn test -Pproxy-linting -Denv=${params.apigee_env} -Dorg=${params.apigee_org} > linting.html"
                   // bat "mvn test apigeelint -s apiproxy/ -f html.js > linting.html"
                    
                }
            }
        }
    
        
        
        
            stage('Static Code Analysis, Unit Test and Coverage') {
            
                steps {
                    dir('edge') {
                    bat "mvn test -Pproxy-unit-test "
                }
            }
        }

           stage('Pre-Deployment Configuration - Caches') {
    steps {
        dir("edge") {

                println "Predeployment of Caches "
                withCredentials([usernamePassword(credentialsId: "edge-ms-${params.apigee_org}-cred",
                        passwordVariable: 'apigee_pwd',
                        usernameVariable: 'apigee_user')]) {
                    bat "mvn apigee-config:caches " +
                            "    -Papigee -Denv=${params.apigee_env} -Dorg=${params.apigee_org} " +
                            "    -Dusername=${apigee_user} " +
                            "    -Dpassword=${apigee_pwd}"
                }

        }
    }
}

            stage('Pre-Deployment Configuration - targetservers') {
                steps {
                    dir('edge') {
                    println "Predeployment of targetservers "
                    withCredentials([usernamePassword(credentialsId: "edge-ms-${params.apigee_org}-cred",
                        passwordVariable: 'apigee_pwd',
                        usernameVariable: 'apigee_user')]) {
                        bat "mvn apigee-config:targetservers " +
                            "    -Papigee -Denv=${params.apigee_env} -Dorg=${params.apigee_org} " +
                            "    -Dusername=${apigee_user} " +
                            "    -Dpassword=${apigee_pwd}"

                }
            }
        }
  }
            stage('Pre-Deployment Configuration - keyvaluemaps ') {
                steps {
                    dir('edge') {
                    println "Predeployment of keyvaluemaps  "
                    withCredentials([usernamePassword(credentialsId: "edge-ms-${params.apigee_org}-cred",
                        passwordVariable: 'apigee_pwd',
                        usernameVariable: 'apigee_user')]) {
                    bat "mvn apigee-config:keyvaluemaps " +
                            "    -Papigee -Denv=${params.apigee_env} -Dorg=${params.apigee_org} " +
                            "    -Dusername=${apigee_user} " +
                            "    -Dpassword=${apigee_pwd}"

                }
            }
        }
            }
            stage('Build proxy bundle') {
                steps {
                    dir('edge') {
                    withCredentials([usernamePassword(credentialsId: "edge-ms-${params.apigee_org}-cred",
                        passwordVariable: 'apigee_pwd',
                        usernameVariable: 'apigee_user')]) {
                        bat "mvn package -Papigee -Denv=${params.apigee_env} -Dorg=${params.apigee_org}"

                }
            }
        }
            }
            stage('Deploy proxy bundle') {
                steps {
                    dir('edge') {
                   withCredentials([usernamePassword(credentialsId: "edge-ms-${params.apigee_org}-cred",
                        passwordVariable: 'apigee_pwd',
                        usernameVariable: 'apigee_user')]) {
                        bat "mvn apigee-enterprise:deploy -Papigee -Denv=${params.apigee_env} -Dorg=${params.apigee_org} -Dusername=${apigee_user} -Dpassword=${apigee_pwd}"
                }
            }
        }
            }         
                stage('Post-Deployment Configurations for API ') {
                steps {
                    dir('edge') {
                    println "Post-Deployment Configurations for API Products Configurations, App Developer and App Configuration "
                    withCredentials([usernamePassword(credentialsId: "edge-ms-${params.apigee_org}-cred",
                        passwordVariable: 'apigee_pwd',
                        usernameVariable: 'apigee_user')]) {
                        bat "mvn -Papigee -Denv=${params.apigee_env} -Dorg=${params.apigee_org} " +
                            "    -Dapigee.config.options=create " +
                            "    -Dusername=${apigee_user} -Dpassword=${apigee_pwd} " +
                            "    apigee-config:apiproducts " +
                            "    apigee-config:developers apigee-config:apps apigee-config:exportAppKeys"
                }
            }
        }
   }

            stage('Coverage Test Report') {
                steps {
                    dir('edge') {
                    publishHTML(target: [
                            allowMissing         : false,
                            alwaysLinkToLastBuild: false,
                            keepAll              : false,
                            reportDir            : "target/unit-test-coverage/lcov-report",
                            reportFiles          : 'index.html',
                            reportName           : 'HTML Report'
                    ]
                    )
                }
            }
        }
        
    }
}

