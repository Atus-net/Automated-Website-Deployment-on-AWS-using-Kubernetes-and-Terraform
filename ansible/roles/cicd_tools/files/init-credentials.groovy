import jenkins.model.*
import com.cloudbees.plugins.credentials.*
import com.cloudbees.plugins.credentials.domains.*
import org.jenkinsci.plugins.plaincredentials.impl.StringCredentialsImpl
import hudson.util.Secret

def j = Jenkins.get()
def store = j.getExtensionList('com.cloudbees.plugins.credentials.SystemCredentialsProvider')[0].getStore()
def domain = Domain.global()

def env = System.getenv()
def sonarToken = env.get('SONARQUBE_TOKEN')

def upsert(id, cred) {
  def existing = store.getCredentials(domain).find { it.id == id }
  if (existing != null) {
    store.updateCredentials(domain, existing, cred)
    println("Updated credential: " + id)
  } else {
    store.addCredentials(domain, cred)
    println("Added credential: " + id)
  }
}

if (sonarToken && sonarToken.trim()) {
  def c = new StringCredentialsImpl(
    CredentialsScope.GLOBAL,
    "sonar-token",
    "SonarQube token",
    Secret.fromString(sonarToken)
  )
  upsert("sonar-token", c)
} else {
  println("Sonar token not set (SONARQUBE_TOKEN). Skipping.")
}

j.save()
