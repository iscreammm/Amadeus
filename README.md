# Amadeus - @Amadeus_TelegramBot
Разработка телеграмм-бота для помощи студентам.

Функционал бота:

--Ежедневник;

--Расписание;

--Связь между студентами одной группы;

--Полезные ссылки;

# Архитектура проекта

С4

![Диаграмма без названия](https://user-images.githubusercontent.com/91844183/149617738-8082b4c3-9cfd-42cd-ba3c-ffb14cb9f201.png)

Ссылка на dockerhub https://hub.docker.com/repository/docker/papirosa228/amadeusbot

# Команда проекта
Yaroslav Polyakov - 3530904/90101

Anton Kurtishev - 3530904/90101

Arthur Nasonov - 3530904/90101

Alexey Sidorov - 3530904/90101

# Тестирование
/remind:

1) Ввод корректных данных:

![image](https://user-images.githubusercontent.com/91844024/149619388-41205f9b-a6bc-4a8c-9319-46fb716d2b71.png)

2) Ввод ошибочных данных:

![image](https://user-images.githubusercontent.com/91844024/149619404-5c6251ea-3e0a-451d-a025-b78c8c943635.png)

/getNotes:

1) Вывод не пустого ежедневника:

![image](https://user-images.githubusercontent.com/91844024/149619455-32c1834d-4917-48dc-be6f-bf52ab3dc7e9.png)

2) Вывод после наступления времени записи и её удаления из списка:

![image](https://user-images.githubusercontent.com/91844024/149619498-58ee5935-9431-4013-8030-29fcd54c9dbe.png)

/setGroup:

1) Ввод корректных данных:

![image](https://user-images.githubusercontent.com/91844024/149619562-81c68818-9e00-4684-8147-a36877d2f86b.png)

2) Ввод ошибочных данных:

![image](https://user-images.githubusercontent.com/91844024/149619577-adb399f0-c04b-4460-9dc7-df7ad9d6d25e.png)

/getGroupNote:

1) Вывод не пустой доски заметок группы:

![image](https://user-images.githubusercontent.com/91844024/149619875-fe48659f-c48a-41d0-bade-4e9d9afa7d0c.png)

2) Вывод доски после удаления:

![image](https://user-images.githubusercontent.com/91844024/149619932-b0822832-09e0-49f3-a63d-2ed57051e772.png)

/addGroupNote:

![image](https://user-images.githubusercontent.com/91844024/149619842-8eb372b6-fe3f-4009-9309-c993b1122f11.png)

/deleteGroupNote:

1) Удаление существующей записи:

![image](https://user-images.githubusercontent.com/91844024/149619970-c56265d8-a08f-4807-9fcf-d9f5deab524f.png)

2) Удаление несуществующей записи:

![image](https://user-images.githubusercontent.com/91844024/149619991-7a3f43bc-d85b-465d-be4d-d186650abca2.png)

/getSchedule:

![image](https://user-images.githubusercontent.com/91844024/149620077-71f62dce-a33a-477b-9112-d82d9488a12b.png)

Также особенности работы последних 4 методов без предварительного указания группы:

![image](https://user-images.githubusercontent.com/91844024/149620118-f01df4b2-1e5f-4975-9dcf-a0be7517b3d8.png)
