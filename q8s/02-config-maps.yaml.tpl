---
apiVersion: v1
kind: ConfigMap
metadata:
  name: sent-mobilite-config-map
  namespace: chefbe
data:
  MAILER_HOST: smtp.mandrillapp.com
  MAILER_PORT: "2525"
  MAILER_DOMAIN: "<domain>"
  MAILER_USER: "<user>"
  MAILER_PASSWORD: "<pass>"
