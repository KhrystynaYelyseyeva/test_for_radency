
## [DEMO](https://khrystynayelyseyeva.github.io/test_for_radency/)

### Завдання:
- Створіти файл csv з відповідною структурою.
- Зчитати його та провалідувати відповідно до наданих правил.
- Вивести на екран таблицю з підсвіченими комірками.
- Додайти до таблиці колонку ID і дайти унікальний ідентифікатор кожному рядку (1,2,3 …).
- Додати до таблиці стовпець Duplicate with (буде використаний при валідації п.2).

###Правила валідації:
- Дані можуть мати пробіл перед або після тексту, тому він має бути ігнорований.
- Email та Phone повинні бути унікальними в межах файлу. AlexCho@cho.com це те ж саме, що і alexCHO@CHO.coM . У стовпці Duplicate with має бути наведений ID першого знайденого рядка, з яким дублюються email / phone поточного.
- Age - має бути типу integer. Не менше, ніж 21 рік.
- Experience - більше або рівний 0 (current Age - 21)
- Yearly income - може бути типу integer або decimal, але завжди відображений з двома знаками після коми. Не більше 1 млн.
- Всі числові значення мають бути >= 0 (в залежності від поля - вік не може бути 0)
- License states - можуть бути у вигляді скорочення, або мати повне ім’я (AL, Alabama). Проте відображені лише у короткому форматі. Значень може бути декілька, розділені вертикальною рискою | .
- Expiration date - може прийматись у двох форматах (YYYY-MM-DD або MM/DD/YYYY). Все інше - помилка. Не може бути менше поточної дати.
- Phone - має бути відображений у форматі +1хххххххххх (десять знаків після +1). Проте імпортувати можна у форматах: +1хххххххххх, 1ххххххххх, хххххххххх
- Has children - приймається у вигляді TRUE / FALSE значень. Пуста комірка приймається як FALSE. Все інше - помилка.
- License number - 6 знаків, що складаються з чисел або текстових символів.
- Full Name  / Phone / Email - є обов'язковими полями. Якщо одного з них немає  - замість таблиці треба показати повідомлення, що файл не є корректним. Таке саме повідомлення показати, якщо формат файлу не є csv. Якщо назва заголовку має інший кейз - full Name, поле вважається валідним.