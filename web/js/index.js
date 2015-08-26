$(function () {
  $("#add").on('click', function (event) {
    var input = $('input');
    var todo = input.val();
    input.val('');
    $('#todo_list').append('<li><button class="remove">X</button>' + todo + '</li>');
  });

  $('#todo_list').on('click', '.remove', function (event) {
    $(this).parent().remove();
  });
});