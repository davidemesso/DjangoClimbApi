erDiagram
    User {
        int id PK
        string username
        string password
        string email
        string first_name
        string last_name
        bool is_staff
        bool is_superuser
    }
    Route {
        int id PK
        string name
        string description
        int difficulty
        dateonly end_date
        image image
    }
    News {
        int id PK
        string title
        string content
        datetime insert_date
        int posted_by FK
    }
    News }|--|| User: post
    Favorite {
        int id PK
        int user FK
        int route FK
    }
    User }o--|| Favorite : have
    Route }o--|| Favorite : is

    Price {
        int id PK
        string article
        float price
    }

    Certificate {
        int id PK
        file file
        dateonly expire_date
        int user FK
    }
    Certificate |o--|| User: upload
    Course }|--|| User: hold

    Course {
        int id PK
        string title
        string description
        datetime date
        int held_by FK
        float price
        int max_people
    }

    Participation {
        int id PK
        int user FK
        int course FK
    }

    Course }o--|| Participation : participants
    User }o--|| Participation : participate