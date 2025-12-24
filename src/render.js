const RenderPosition = {
  BEFOREBEGIN: 'beforebegin', // перед элементом-контейнером
  AFTERBEGIN: 'afterbegin', // внутри элемента-контейнера перед его первым реебнком
  BEFOREEND: 'beforeend', // полсе последнего ребенком внутри элемента-контейнера перед закрывающим тегом
  AFTEREND: 'afterend', // после элемента-контейнера
};

function createElement(template) {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild; // возвращает template. созданный div остается не используемым
}

/**
 *
 * @param {*obj} component созданные компонент определенного класса
 * @param {*element} container оболочка, куда нужно поместить компонент
 * @param {*position} place где именно надо поместить
 */
function render(component, container, place = RenderPosition.BEFOREEND) {
  container.insertAdjacentElement(place, component.getElement());
}

export {RenderPosition, createElement, render};
