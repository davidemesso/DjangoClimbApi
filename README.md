# DjangoClimbApi
Progetto di Tecnologie Web.
Implementazione di backend e frontend per un sito dedicato ad una fittizia palestra d'arrampicata.

## Il progetto

La piattaforma deve essere in grado di:
- Visualizzare i percorsi disponibili, con la loro immagine, le loro informazioni, un sistema di ricerca con filtro e ordinamento
- Visualizzare una bacheca con gli eventi e aggiornamenti
- Permettere la registrazione dell’utente e fornire funzionalità specifiche
- Gestione dei corsi messi a disposizione dalla palestra, associati ai membri dello staff che li tengono, e servizio di prenotazione.
- Sezione per caricare il proprio certificato medico che può essere visualizzato solo dallo staff, con scadenza
- Inserimento, modifica, consultazione di diversi piani di abbonamento disponibili e prezzi vari da visualizzare
- Sistema per selezionare i percorsi preferiti e che consiglia sulla base di essi, e dei più piaciuti agli utenti in generale, percorsi più affini da provare
- Una schermata nella quale in realtime gli utenti possono postare quale percorso hanno appena completato e gli altri possono aggiungere una reazione “ale” per complimentarsi

L’applicazione prevede la presenza di diversi tipi di utente:

Superadmin:
- Inserisce lo staff
- Fa tutto

Staff:
- Crud percorsi
- Crud corsi
- Crud news
- Crud abbonamenti e prezzi
- Visualizzazione info utenti e certificati medici

Utente registrato:
- Mette like ai percorsi e visualizza consigli
- Inserisce certificato medico
- Prenota corsi
- Posta completamenti e reazioni alè
  
Utente anonimo:
- Visualizza e consulta ma non interagisce
- Ricerca filtrata per difficoltà e ordinata per like o completamenti
- Può registrarsi

## Tecnologie

Tool principali per la costruzione:
- Django (REST)
- Django channels
- Vite
- React ts
- Material UI
- Tailwind

Pipfile per backend:
```
[packages]
django-rest-framework = "*"
django = "*"
django-cors-headers = "*"
djangorestframework-simplejwt = "*"
pillow = "*"
channels = {extras = ["daphne"], version = "*"}
```

package.json per frontend:
```
"dependencies": {
  "@emotion/react": "^11.11.1",
  "@mui/icons-material": "^5.11.16",
  "@mui/x-data-grid": "^6.8.0",
  "@mui/x-data-grid-pro": "^6.8.0",
  "@mui/x-date-pickers": "^6.7.0",
  "axios": "^1.4.0",
  "dayjs": "^1.11.8",
  "jose": "^4.14.4",
  "mui-file-input": "^2.0.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.11.2",
  "tailwindcss-animate": "^1.0.5"
},
"devDependencies": {
  "@typescript-eslint/parser": "^5.59.0",
  "@vitejs/plugin-react-swc": "^3.0.0",
  "tailwindcss": "^3.3.2",
  "typescript": "^5.0.2",
  "vite": "^4.3.9"
}
```
(solo i principali)

## Installazione

```
git clone https://github.com/davidemesso/DjangoClimbApi.git
cd DjangoClimbApi
```

Da qui avere 2 terminali aperti

```
cd Backend
pipenv shell
pipenv install
cd climb
python3 ./manage.py migrate
python3 ./manage.py createsuperuser (interattivo)
python3 ./manage.py runserver

python3 ./manage.py test (per unit tests)
```

```
cd Frontend
npm install
cd climb-frontend
npm install
npm audit fix (opzionale ma consigliato)
npm run (oppure npm run build -> npm run preview)
```
