#!/usr/bin/env groovy

pipeline {
    agent any

	//
    // The following parameters can be selected when the pipeline is executed manually to execute
    // different capabilities in the pipeline or configure the servers that are used.

    // Note: the pipeline needs to be executed at least once for the parameters to be available
    //
    parameters {         
        booleanParam(name: 'FORTIFY_SAST',       	defaultValue: params.FORTIFY_SAST ?: true,
                description: 'Use Fortify for Static Application Security Testing')
        booleanParam(name: 'FORTIFY_DAST',       	defaultValue: params.FORTIFY_DAST ?: false,
                description: 'Use Fortify for Dynamic Application Security Testing')       
        booleanParam(name: 'UPLOAD_TO_SSC',		    defaultValue: params.UPLOAD_TO_SSC ?: true,
                description: 'Enable upload of scan results to Fortify Software Security Center')                   
    }

    environment {
        // Application settings
        APP_NAME = "IWAExpress"                                // Application name
        APP_VER = "master"                                  // Application release - GitHub master branch
        COMPONENT_NAME = "IWAExpress"                          // Component name
        GIT_URL = scm.getUserRemoteConfigs()[0].getUrl()    // Git Repo
        ISSUE_IDS = ""                                      // List of issues found from commit

        // Credential references
        GIT_CREDS = credentials('iwaexpress-git-creds-id')
        SSC_PASSWORD = credentials('iwaexpress-ssc-password-id')
       
        // The following are defaulted and can be overriden by creating a "Build parameter" of the same name
        SSC_URL = "${params.SSC_URL ?: 'http://ssc.mfdemouk.com'}" // URL of Fortify Software Security Center
        SSC_USERNAME = "${params.SSC_USERNAME ?: 'admin'}" // Default user login for Fortify Software Security Center
        SSC_PARENT_RELEASE = "${params.SSC_MASTER_RELEASE ?: 'master'}" // Default Parent Release, e.g. "master" to copy from when creating new version

	}

    stages {
        stage('Build') {
            // Run on "fortify" node
            agent { label 'master' }
            steps {
                // Get some code from a GitHub repository
                echo 'Pulling...' + env.BRANCH_NAME
                git credentialsId: 'iwaexpress-git-creds-id', url: "${env.GIT_URL}"

                // Get Git commit details
                script {
                    if (isUnix()) {
                        sh 'git rev-parse HEAD > .git/commit-id'
                    } else {
                        bat(/git rev-parse HEAD > .git\\commit-id/)
                    }
                    //bat(/git log --format="%ae" | head -1 > .git\commit-author/)
                    env.GIT_COMMIT_ID = readFile('.git/commit-id').trim()
                    //env.GIT_COMMIT_AUTHOR = readFile('.git/commit-author').trim()

                    println "Git commit id: ${env.GIT_COMMIT_ID}"
                    //println "Git commit author: ${env.GIT_COMMIT_AUTHOR}"

                    // Run npm install
                    if (isUnix()) {
                        sh 'npm install'
                        sh 'MOCHA_FILE=./jenkins-test-results.xml ./node_modules/.bin/mocha tests/** --reporter mocha-junit-reporter'
                    } else {
                        bat "npm install"
                        bat "MOCHA_FILE=.\\jenkins-test-results.xml .\\node_modules\\.bin\\mocha tests\\** --reporter mocha-junit-reporter"
                    }
                }
            }

            post {
                success {
                    // Record the test results (success)
                    junit "**/jenkins-test-results.xml"
                }
                failure {
                    // Record the test results (failures)
                    junit "**/jenkins-test-results.xml"
                }
            }
        }

        stage('SAST') {
            when {
            	beforeAgent true
            	anyOf {
            	    expression { params.FORTIFY_SAST == true }
        	    }
            }
            // Run on an Agent with "fortify" label applied
            agent {label "fortify"}
            steps {
                script {
                    // Get code from Git repository so we can recompile it
                    echo 'Pulling...' + env.BRANCH_NAME
                	git credentialsId: 'iwaexpress-git-creds-id', url: "${env.GIT_URL}"

                    // Run npm install
                    if (isUnix()) {
                        sh "npm install"
                        sh "node -r esm ssc/main.js copyVersion --verName \"${env.BRANCH_NAME}\" --appName \"${env.APP_NAME}\" --copyFrom \"${env.SSC_PARENT_RELEASE}\""
                    } else {
                        bat "npm install"
                        bat "node -r esm ssc/main.js copyVersion --verName \"${env.BRANCH_NAME}\" --appName \"${env.APP_NAME}\" --copyFrom \"${env.SSC_PARENT_RELEASE}\""
                    }

                    if (params.FORTIFY_SAST) {
                        println "Starting FORTIFY SAST for Release: ${env.BRANCH_NAME}"
                        // optional: update scan rules
                        //fortifyUpdate updateServerURL: 'https://update.fortify.com'

                        // Clean project and scan results from previous run
                        fortifyClean buildID: "${env.COMPONENT_NAME}",
                            logFile: "${env.COMPONENT_NAME}-clean.log"

                        fortifyTranslate buildID: "${env.COMPONENT_NAME}",
                            excludeList: '\""node_modules/**/*\""', 
                            projectScanType: fortifyOther(
                                otherIncludesList: '.',
                                otherOptions: '"-Dcom.fortify.sca.Phase0HigherOrder.Languages=javascript,typescript","-Dcom.fortify.sca.EnableDOMModeling=true"'), 
                            addJVMOptions: '', 
                            debug: true,     
                            verbose: true,
                            logFile: "${env.COMPONENT_NAME}-translate.log"

                        // Scan source files
                        fortifyScan buildID: "${env.COMPONENT_NAME}",
                            addOptions: "\"-build-project\" \"\"IWAExpress\"\" \"-build-version\" \"${env.BRANCH_NAME}\" \"-build-label\" \"${env.BUILD_URL}\"",
                            resultsFile: "${env.COMPONENT_NAME}.fpr",
                            addJVMOptions: '',
                            debug: false,   
                            verbose: true,
                            logFile: "${env.COMPONENT_NAME}-scan.log"

                        if (params.UPLOAD_TO_SSC) {
                            // Upload to SSC
                            fortifyUpload appName: "${env.APP_NAME}",
                                appVersion: "${env.BRANCH_NAME}",
                                resultsFile: "${env.COMPONENT_NAME}.fpr"
                        }
                    } else {
                        println "No Static Application Security Testing (SAST) to do."
                    }
                }
            }
        }

        stage('Deploy') {
            // Run on "master" node
            agent { label 'master' }
            steps {
                script {
                    // unstash the built files
                    //unstash name: "${env.COMPONENT_NAME}_release"
                    println "Deploying application ..."
                }
            }
        }

        stage('DAST') {
            when {
            	beforeAgent true
            	anyOf {
            	    expression { params.FORTIFY_DAST == true }
        	    }
            }
            // Run on an Agent with "fortify" label applied
            agent {label "fortify"}
            steps {
                script {                    
                    if (params.FORTIFY_DAST) {
                        println "DAST via FORTIFY is not yet implemented."
                    } else {
                        println "No Dynamic Application Security Testing (DAST) to do."
                    }
                }
            }
        }
        
		// An example manual release checkpoint
        stage('Stage') {
        	agent { label 'master' }
        	steps {
                println "Skipping manual approval..."
            	//input id: 'Release',
            	//	message: 'Ready to Release?',
            	//	ok: 'Yes, let\'s go',
            	//	submitter: 'admin',
            	//	submitterParameter: 'approver'
        	}
        }

        stage('Release') {
            agent { label 'master' }
            steps {
                script {
                    println "Releasing application ..."
                }
            }
        }

    }

}
