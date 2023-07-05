graph LR

subgraph Superadmin
  A((Superadmin))
end

subgraph Staff
  B((Staff))
end

subgraph "Utente registrato"
  C((Utente registrato))
end

subgraph "Utente anonimo"
  D((Utente anonimo))
end

subgraph "Percorsi"
  E((Percorsi))
end

subgraph Corsi
  F((Corsi))
end

subgraph News
  G((News))
end

subgraph "Abbonamenti e prezzi"
  H(("Abbonamenti e prezzi"))
end

subgraph "Utenti e certificati medici"
  I(("Utenti e certificati medici"))
end

A -->|Inserisce lo staff| B

B -->|Crud percorsi| E
B -->|Crud corsi| F
B -->|Crud news| G
B -->|Crud abbonamenti e prezzi| H
B -->|Visualizzazione info utenti e certificati medici| I

C -->|Mette like ai percorsi e visualizza consigli| E
C -->|Inserisce certificato medico| I
C -->|Prenota corsi| F
C -->|Posta completamenti e reazioni| E

D -->|Visualizza e consulta ma non interagisce| H
D -->|Visualizza e consulta ma non interagisce| E 
D -->|Visualizza e consulta ma non interagisce| F 
D -->|Visualizza e consulta ma non interagisce| G 
D -->|Ricerca filtrata per difficoltà e ordinata per like o completamenti| E
D -->|Può registrarsi| C

