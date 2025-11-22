import $ from 'jquery';

export default function (container) {
  const ul = $('<ul>').appendTo(container);
  let html = '';
  for (var i = 1; i <= 20; i++) {
    html += `<li>新闻${i}</li>`;
  }
  ul.html(html);
}
