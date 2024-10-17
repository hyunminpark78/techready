def SERVICE_GROUP = "ocp"
def SERVICE_NAME = "ops2client"
def IMAGE_NAME = "${SERVICE_GROUP}-${SERVICE_NAME}"
def REPOSITORY_URL = "https://code.bespinglobal.com/scm/ray/ops2client.git"
def REPOSITORY_SECRET = "bespin-poc"
def SLACK_TOKEN_DEV=""
def SLACK_TOKEN_DQA=""

@Library("bespin-pipeline-library")
def butler = new com.bespin.devops.JenkinsPipeline()
def label = "node10"

properties([
  buildDiscarder(logRotator(daysToKeepStr: "60", numToKeepStr: "30"))
])
 podTemplate {
  node(label) {
    stage("Prepare") {
      container("builder") {
        butler.prepare(IMAGE_NAME)
      }
    }
    stage("Checkout") {
      container("builder") {
        try {
          if (REPOSITORY_SECRET) {
            git(url: REPOSITORY_URL, branch: BRANCH_NAME, credentialsId: REPOSITORY_SECRET)
          } else {
            git(url: REPOSITORY_URL, branch: BRANCH_NAME)
          }
        } catch (e) {
          butler.failure(SLACK_TOKEN_DEV, "Checkout")
          throw e
        }

         butler.scan("nodejs")
      }
    }

    stage("Build") {
      container("node") {
        try {
          butler.npm_build()
          butler.success(SLACK_TOKEN_DEV, "Build")
        } catch (e) {
          butler.failure(SLACK_TOKEN_DEV, "Build")
          throw e
        }
      }
    }

     stage("Code Analysis") {
         container("node") {
           try {
             butler.npm_sonar()
             butler.success(SLACK_TOKEN_DEV, "Code Analysis")
           } catch (e) {
             butler.failure(SLACK_TOKEN_DEV, "Code Analysis")
             throw e
           }
         }
       }
    if (BRANCH_NAME == "dev") {
      stage("Build Image") {
        parallel(
          "Build Docker": {
            container("builder") {
              try {
                butler.build_image()
              } catch (e) {
                butler.failure(SLACK_TOKEN_DEV, "Build Docker")
                throw e
              }
            }
          },
          "Build Charts": {
            container("builder") {
              try {
                butler.build_chart()
              } catch (e) {
                butler.failure(SLACK_TOKEN_DEV, "Build Charts")
                throw e
              }
            }
          }
        )
      }
      stage("Deploy SANDBOX") {
        container("builder") {
          try {
            // deploy(cluster, namespace, sub_domain, profile)
            butler.deploy("dev", "${SERVICE_GROUP}-sandbox", "${IMAGE_NAME}-sandbox", "dev")
            butler.success(SLACK_TOKEN_DEV, "Deploy SANDBOX")
          } catch (e) {
            butler.failure(SLACK_TOKEN_DEV, "Deploy SANDBOX")
            throw e
          }
        }
      }
    }
    else if (BRANCH_NAME == "stage") {
      stage("Build Image") {
        parallel(
          "Build Docker": {
            container("builder") {
              try {
                butler.build_image()
              } catch (e) {
                butler.failure(SLACK_TOKEN_DEV, "Build Docker")
                throw e
              }
            }
          },
          "Build Charts": {
            container("builder") {
              try {
                butler.build_chart()
              } catch (e) {
                butler.failure(SLACK_TOKEN_DEV, "Build Charts")
                throw e
              }
            }
          }
        )
      }
      stage("Deploy STAGE") {
        container("builder") {
          try {
            // deploy(cluster, namespace, sub_domain, profile)
            butler.deploy("dev", "${SERVICE_GROUP}-stage", "${IMAGE_NAME}-stage", "stage")
            butler.success(SLACK_TOKEN_DEV, "Deploy STAGE")
          } catch (e) {
            butler.failure(SLACK_TOKEN_DEV, "Deploy STAGE")
            throw e
          }
        }
      }
    }
    else if (BRANCH_NAME == "master") {
      stage("Build Image") {
        parallel(
          "Build Docker": {
            container("builder") {
              try {
                butler.build_image()
              } catch (e) {
                butler.failure(SLACK_TOKEN_DEV, "Build Docker")
                throw e
              }
            }
          },
          "Build Charts": {
            container("builder") {
              try {
                butler.build_chart()
              } catch (e) {
                butler.failure(SLACK_TOKEN_DEV, "Build Charts")
                throw e
              }
            }
          }
        )
      }
      stage("Deploy Job") {
          container("builder") {
              ver = butler.get_version()
              try {
                build job: 'ray-pipeline/www.opsnow.com/ray-ops2client/master', parameters: [string(name: 'version', value: ver)]
              } catch (hudson.AbortException e) {
                echo "Deploy Abort"
              } catch (e) {
                throw e
              }

          }
      }
    }
  }
}

