# Слайдер Only

## Описание
Тз для Only слайдер исторических дат адаптивный

## Установка и запуск
В проекте сразу одна директория frontend (front).

### Запуск frontend:
Выполнить в директории front:
```bash
npm i
```
Запуск:
```bash
npm start # запуск в режиме разработчика
npm build # Забилдить проект 
```

## Структура проекта

### Frontend
- public - Корневая папка приложения
  - index.html - главая страница сайта c id=root в нее реакт подгружает все остальное
- src - Папка в которой лежит вся структура проекта
  -  assets - папка для прочего
    -  fonts - шрифты
    -  img - изображения
  -  сomponents - Все компоненты
  -  modules - Модули
  -  hooks - Кастомные хуки
  -  style - Глобальные стили к index.html, миксины и цвета вынесенные отдельно
  -  ui - Различные Ui компоненты, кнопочки, инпуты
  -  App.js - Главный исполняемый файл с контекстами роутаами состояниями и тд
 
## Ветки

* main - основная ветка.
