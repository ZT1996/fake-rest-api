import {http} from './http';
import {ui} from './ui';

document.addEventListener('DOMContentLoaded', getPosts);
document.querySelector('.post-submit').addEventListener('click', submitPost);
document.querySelector('#posts').addEventListener('click', editPost);
document.querySelector('#posts').addEventListener('click', enableEdit);
document.querySelector('.card-form').addEventListener('click', cancelEdit);

function getPosts(){
  http.get('http://localhost:3000/posts')
  .then(data => ui.showPosts(data))
  .catch(error => console.log(error));
}

function submitPost(){
  const title = document.querySelector('#title').value;
  const body = document.querySelector('#body').value;
  const id = document.querySelector('#id').value;
  if(title === '' || body === ''){
    ui.showAlert('please fill in all fileds', 'alert alert-danger');
  }
  else{
    const data = {
      title,
      body
    };
    if(id === ''){
      http.post('http://localhost:3000/posts', data)
      .then(res => {
        ui.showAlert('Post added', 'alert alert-success');
        ui.clearFields();
        getPosts();
      })
      .catch(err => console.log(err));
    }
    else{
      http.put(`http://localhost:3000/posts/${id}`, data)
      .then(res => {
        ui.showAlert('Post updated', 'alert alert-success');
        getPosts();
        ui.changeFormState('add');
        ui.clearFields();
      })
      .catch(err =>{
        console.log(err);
      });
    }
    
  }
  
}

function editPost(e){
  if(e.target.classList.contains('fa-remove')){
    const id = ui.removePost(e.target);
    http.delete(`http://localhost:3000/posts/${id}`)
    .then(res => {
      ui.showAlert('Post deleted', 'alert alert-success');
    })
    .catch(err => {
      ui.showAlert('Post can not be deleted', 'alert alert-warning');
    })
  }

  e.preventDefault();
}


function enableEdit(e){
  if(e.target.parentElement.classList.contains('edit')){
    const id = e.target.parentElement.dataset.id;
    const body = e.target.parentElement.previousElementSibling.textContent;
    const title = e.target.parentElement.previousElementSibling.previousElementSibling.textContent;
    const data = {
      id,
      title,
      body
    };
    ui.fillForm(data);
  }
  e.preventDefault();
}


function cancelEdit(e){
  if(e.target.classList.contains('post-cancel')){
    ui.changeFormState('add');
  }

  e.preventDefault();
}