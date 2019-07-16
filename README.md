# Setup

## Firestore Emulator

Currently the firestore emilator cannot be used, as it's not available on the browser.

See: https://github.com/firebase/firebase-tools/issues/1001

Because the functions emulator uses the firestore emulator by default, we'll need to
configure it to use the real firebase server for the moment.

This means you'll need to create a service account credential in:

Firebase Console -> Project settings -> Service accoutns -> Generate new private key

This should give you a json file, which you'll need to move to `functions/.serviceaccount.json`. It'll look something like this:

```bash
{
  "type": "service_account",
  "project_id": "...",
  "private_key_id": "...",
  "private_key": "...",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}

```


### Once Firestore Emulator is usable within browsers...

```bash
firebase setup:emulators:firestore
```

If it doesn't work at first, you may need to install a recent version of the [Java Development Kit](https://www.oracle.com/technetwork/java/javase/downloads/jdk12-downloads-5295953.html)

Note: there has to be a way to get this working without installing Java :-/
See: https://github.com/firebase/firebase-tools/issues/1451

