from datetime import timedelta
import random
from django.contrib.auth.models import User
from climb_api.models import News, Price, Route, Favorite
from climb_auth.models import Certificate
from climb_courses.models import Course, Participation
from django.utils import timezone

def seed_db():
    seed_users()
    seed_news()
    seed_prices()
    seed_certificates()
    seed_courses()
    seed_routes()
    seed_favorites()

def seed_users():
    if User.objects.count() > 1:
        print('Skipping user seeding')
        return

    usernames = ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8', 'user9', 'user10', 'user11', 'user12', 'user13', 'user14', 'user15', 'user16', 'user17', 'user18', 'user19', 'user20']
    passwords = ['password1', 'password2', 'password3', 'password4', 'password5', 'password6', 'password7', 'password8', 'password9', 'password10', 'password11', 'password12', 'password13', 'password14', 'password15', 'password16', 'password17', 'password18', 'password19', 'password20']
    names = ['John', 'Jane', 'David', 'Sarah', 'Michael', 'Emily', 'Daniel', 'Olivia', 'Matthew', 'Sophia', 'Christopher', 'Ava', 'Andrew', 'Emma', 'William', 'Isabella', 'Alexander', 'Mia', 'James', 'Charlotte']
    surnames = ['Smith', 'Johnson', 'Brown', 'Taylor', 'Miller', 'Anderson', 'Wilson', 'Clark', 'Lee', 'Walker', 'Hall', 'Young', 'Harris', 'Lewis', 'Robinson', 'Wright', 'King', 'Green', 'Baker', 'Turner']
    domains = ['example.com', 'test.com', 'domain.com', 'mail.com']
    
    for index, (username, password, name, surname) in enumerate(zip(usernames, passwords, names, surnames)):
        email = f"{username}@{random.choice(domains)}"
        user = User.objects.create_user(username=username, password=password, first_name=name, last_name=surname, email=email)
        
        
        # Make some users staff members
        if index < 5:
            user.is_staff = True
            user.save()
            
    
    print('Seeding users completed.')


def seed_news():
    if News.objects.count() > 0:
        print('Skipping news seeding')
        return
    
    usernames = ['user1', 'user2', 'user3', 'user4', 'user5']
    titles = ['Apertura Nuova Palestra di Arrampicata', 'Tecniche Avanzate di Allenamento per Arrampicatori', 'Competizioni Indoor di Arrampicata', 'Consigli di Sicurezza per il Bouldering', 'Consigli su Attrezzature per l\'Arrampicata']
    contents = [
        'Una nuova palestra di arrampicata all\'avanguardia sta aprendo in città. Questo nuovo centro offre pareti di arrampicata di varie difficoltà, un\'area boulder spaziosa e attrezzature moderne.\nSia che tu sia un principiante o un arrampicatore esperto, questa palestra sarà il posto perfetto per mettere alla prova le tue abilità e divertirti in sicurezza.',
        'Desideri migliorare le tue abilità di arrampicata? Impara le tecniche avanzate di allenamento dagli arrampicatori professionisti. Questo corso intensivo coprirà la forza, l\'equilibrio, la resistenza e la flessibilità.\nSia che tu voglia affrontare sfide più difficili o prepararti per competizioni, queste tecniche ti daranno il vantaggio di cui hai bisogno.',
        'Le competizioni indoor di arrampicata sono un\'eccellente opportunità per mostrare le tue abilità e competere con altri appassionati di arrampicata. Sfida te stesso su diverse vie di arrampicata, dimostra la tua resistenza e supera i tuoi limiti.\nNon importa se sei un principiante o un arrampicatore esperto, partecipa e goditi l\'adrenalina delle gare.',
        'Il bouldering può essere un\'attività entusiasmante, ma richiede precauzioni per assicurare la tua sicurezza. Segui questi consigli di sicurezza essenziali: assicurati che l\'area di arrampicata sia ben spaziosa e ammortizzata, controlla attentamente le prese prima di iniziare, apprendi le tecniche di caduta sicura e, soprattutto, non arrampicare mai da solo.',
        'Scegliere le giuste attrezzature per l\'arrampicata è fondamentale per una buona esperienza di arrampicata. Abbiamo selezionato le migliori scarpe da arrampicata, imbracature, caschi, moschettoni e corde per te.\nQueste attrezzature ti forniranno la sicurezza e la comodità necessarie per affrontare le tue sfide di arrampicata con fiducia.'
    ]

    for title, content in zip(titles, contents):
        username = random.choice(usernames)
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            print(f"User '{username}' does not exist. Skipping news creation.")
            continue

        News.objects.create(
            title=title,
            content=content,
            posted_by=user
        )

    print('Seeding news completed.')
    
    
def seed_prices():
    if Price.objects.count() > 0:
        print('Skipping price seeding')
        return
    
    prices = [
        {'article': 'Ingresso singolo', 'price': 10},
        {'article': 'Noleggio scarpette', 'price': 2},
        {'article': 'Noleggio attrezzatura scalata', 'price': 1},
        {'article': 'Maglietta', 'price': 20},
        {'article': 'Felpa', 'price': 25},
        {'article': 'Scarpe', 'price': 45},
        {'article': 'Dieci ingressi', 'price': 80},
        {'article': 'Abbonamento mensile', 'price': 60},
    ]

    for price_data in prices:
        Price.objects.create(
            article=price_data['article'],
            price=price_data['price']
        )

    print('Seeding prices completed.')
    
    
def seed_certificates():
    if Certificate.objects.count() > 0:
        print('Skipping certificate seeding')
        return
    
    # Seed certificates for users 6 to 10 (one year in the future)
    for user_id in range(6, 11):
        try:
            user = User.objects.get(username="user"+str(user_id))
        except User.DoesNotExist:
            print(f"User with ID '{user_id}' does not exist. Skipping certificate creation.")
            continue

        expire_date = timezone.now() + timedelta(days=365)
        Certificate.objects.create(
            file=f"certificates/{user_id}/{user_id}.jpeg",
            expire_date=expire_date,
            user=user
        )

    # Seed expired certificates for users 11 and 12
    for user_id in [11, 12]:
        try:
            user = User.objects.get(username="user"+str(user_id))
        except User.DoesNotExist:
            print(f"User with ID '{user_id}' does not exist. Skipping certificate creation.")
            continue

        expire_date = timezone.now() - timedelta(days=30)  # Expired date set to 30 days ago
        Certificate.objects.create(
            file=f"certificates/{user_id}/{user_id}.jpeg",
            expire_date=expire_date,
            user=user
        )

    print('Seeding certificates completed.')
    
    
def seed_courses():
    if Course.objects.count() > 0:
        print('Skipping courses seeding')
        return
    
    usernames = ['user1', 'user2', 'user3', 'user4', 'user5']
    participantsNames = ['user10', 'user11', 'user12', 'user13', 'user14']

    courses = [
        {
            'title': 'Corso Base di Arrampicata',
            'description': 'Un corso introduttivo per imparare le tecniche di base dell\'arrampicata. Vieni a scoprire il mondo verticale!',
            'date': timezone.now() + timedelta(days=30),
            'price': 50,
            'max_people': 10
        },
        {
            'title': 'Corso Avanzato di Bouldering',
            'description': 'Un corso avanzato per migliorare le tue abilità di bouldering. Impara nuove tecniche e supera i tuoi limiti!',
            'date': timezone.now() + timedelta(days=45),
            'price': 70,
            'max_people': 8
        },
        {
            'title': 'Corso di Sicurezza in Parete',
            'description': 'Un corso per imparare le corrette pratiche di sicurezza in parete. Garantisci la tua protezione e quella degli altri arrampicatori.',
            'date': timezone.now() + timedelta(days=60),
            'price': 40,
            'max_people': 12
        }
    ]

    for course_data in courses:
        username = random.choice(usernames)
        try:
            held_by = User.objects.get(username=username)
        except User.DoesNotExist:
            continue

        course = Course.objects.create(
            title=course_data['title'],
            description=course_data['description'],
            date=course_data['date'],
            held_by=held_by,
            price=course_data['price'],
            max_people=course_data['max_people']
        )
        
        participants = random.sample(participantsNames, min(random.randint(0, course_data['max_people']), len(participantsNames)))
        for participant_username in participants:
            try:
                participant = User.objects.get(username=participant_username)
            except User.DoesNotExist:
                continue
            
            Participation.objects.create(user=participant, course=course)
    
    username = random.choice(usernames)
    try:
        held_by = User.objects.get(username=username)
    except User.DoesNotExist:
        return
        
    course = Course.objects.create(
        title="Corso privato molto speciale",
        description="Un corso dedicato ad una sola persona, per imparare personalmente e da vicino le migliori tecniche da esperti del settore.",
        date=timezone.now() + timedelta(days=60),
        held_by=held_by,
        price=100,
        max_people=1
    )
    
    Participation.objects.create(user=held_by, course=course)

    print('Seeding courses completed.')
    
    
def seed_routes():
    if Route.objects.count() > 0:
        print('Skipping routes seeding')
        return
    
    difficulties = [1, 2, 3, 4, 5]

    for difficulty in difficulties:
        for _ in range(3):
            name = generate_random_name()
            description = generate_random_description()
            end_date = timezone.now() + timedelta(days=random.randint(30, 60))
            image_path = 'route_images/'+str(random.randint(1,6))+".png" 

            route = Route.objects.create(
                name=name,
                difficulty=difficulty,
                description=description,
                end_date=end_date,
                image=image_path
            )
    
    for difficulty in difficulties:
        for _ in range(3):
            name = "vecchio " + generate_random_name()
            description = generate_random_description()
            end_date = timezone.now() - timedelta(days=random.randint(30, 60))
            image_path = 'route_images/'+str(random.randint(0,6))+".png" 

            Route.objects.create(
                name=name,
                difficulty=difficulty,
                description=description,
                end_date=end_date,
                image=image_path
            )
            
    print('Seeding routes completed.')

def generate_random_name():
    names = [
        'Via dell\'Avventura',
        'Parete Verticale',
        'Muro di Granito',
        'Cengia delle Aquile',
        'Salita del Coraggio'
    ]

    return random.choice(names)

def generate_random_description():
    descriptions = [
        'Una sfida per i veri arrampicatori. Raggiungi nuove vette e supera i tuoi limiti!',
        'Un percorso emozionante che richiede tecnica e resistenza. Affronta la parete con determinazione!',
        'Un\'esperienza indimenticabile per gli amanti dell\'arrampicata. Goditi panorami mozzafiato!',
        'Un\'opportunità per mettere alla prova la tua agilità e destrezza. Supera gli ostacoli con abilità!',
        'Una scalata avventurosa che ti porterà verso l\'eccellenza. Mostra di cosa sei capace!'
    ]

    return random.choice(descriptions)


def seed_favorites():
    if Favorite.objects.count() > 0:
        print('Skipping favorites seeding')
        return
    
    usernames = ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8', 'user9', 'user10',
                 'user11', 'user12', 'user13', 'user14', 'user15', 'user16', 'user17', 'user18', 'user19', 'user20']

    routes = Route.objects.all()

    for username in usernames:
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            continue

        favorite_routes = random.sample(list(routes), random.randint(1, 15))

        for route in favorite_routes:
            Favorite.objects.create(user=user, route=route)

    print('Seeding favorites completed.')