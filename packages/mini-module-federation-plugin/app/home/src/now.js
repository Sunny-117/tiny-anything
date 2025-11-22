import $ from 'jquery';

export default function (container) {
  const p = $('<p>').appendTo(container).text(new Date().toLocaleString());
  setInterval(function () {
    p.text(new Date().toLocaleString());
  }, 1000);
}
