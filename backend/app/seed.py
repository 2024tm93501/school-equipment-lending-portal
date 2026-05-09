from .database import SessionLocal, engine, Base
from . import models
from .auth import get_password_hash

Base.metadata.create_all(bind=engine)

ADMIN = {"full_name": "System Administrator", "email": "admin@school.edu", "password": "Admin@123", "role": "admin"}

DEMO_USERS = [
    {"full_name": "Mr. Ramesh Kumar", "email": "staff1@school.edu", "password": "Staff@123", "role": "staff"},
    {"full_name": "Priya Sharma", "email": "student1@school.edu", "password": "Student@123", "role": "student"},
    {"full_name": "Arjun Mehta", "email": "student2@school.edu", "password": "Student@123", "role": "student"},
]

EQUIPMENT = [
    {"name": "DSLR Camera (Canon EOS 1500D)", "description": "Canon EOS 1500D with 18-55mm kit lens", "category": "Photography", "total_quantity": 3, "condition": "good"},
    {"name": "Tripod Stand", "description": "Adjustable aluminium tripod, height up to 160cm", "category": "Photography", "total_quantity": 5, "condition": "good"},
    {"name": "Digital Multimeter", "description": "Fluke 101 basic digital multimeter for lab experiments", "category": "Lab Equipment", "total_quantity": 8, "condition": "excellent"},
    {"name": "Oscilloscope", "description": "Rigol DS1054Z 4-channel 50MHz oscilloscope", "category": "Lab Equipment", "total_quantity": 2, "condition": "good"},
    {"name": "Soldering Kit", "description": "25W soldering iron set with stand, solder, and flux", "category": "Lab Equipment", "total_quantity": 10, "condition": "fair"},
    {"name": "Cricket Bat Set", "description": "Full-size cricket bat with pads and gloves", "category": "Sports", "total_quantity": 6, "condition": "good"},
    {"name": "Basketball", "description": "Official size 7 basketball (Spalding)", "category": "Sports", "total_quantity": 10, "condition": "excellent"},
    {"name": "Acoustic Guitar", "description": "Yamaha F310 acoustic guitar with pick and capo", "category": "Musical Instruments", "total_quantity": 4, "condition": "good"},
    {"name": "Keyboard (Casio CT-S300)", "description": "61-key portable keyboard with stand adapter", "category": "Musical Instruments", "total_quantity": 2, "condition": "fair"},
    {"name": "Presentation Clicker", "description": "Logitech R400 wireless presenter with laser pointer", "category": "Project Materials", "total_quantity": 7, "condition": "excellent"},
]


def seed():
    db = SessionLocal()
    try:
        # Admin user
        if not db.query(models.User).filter(models.User.email == ADMIN["email"]).first():
            db.add(models.User(
                full_name=ADMIN["full_name"],
                email=ADMIN["email"],
                hashed_password=get_password_hash(ADMIN["password"]),
                role=ADMIN["role"],
            ))
            print(f"Created admin: {ADMIN['email']}")

        # Demo users
        for u in DEMO_USERS:
            if not db.query(models.User).filter(models.User.email == u["email"]).first():
                db.add(models.User(
                    full_name=u["full_name"],
                    email=u["email"],
                    hashed_password=get_password_hash(u["password"]),
                    role=u["role"],
                ))
                print(f"Created user: {u['email']}")

        # Equipment
        if db.query(models.Equipment).count() == 0:
            for eq in EQUIPMENT:
                db.add(models.Equipment(
                    name=eq["name"],
                    description=eq["description"],
                    category=eq["category"],
                    total_quantity=eq["total_quantity"],
                    available_qty=eq["total_quantity"],
                    condition=eq["condition"],
                ))
            print(f"Created {len(EQUIPMENT)} equipment items")

        db.commit()
        print("Seed complete.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
