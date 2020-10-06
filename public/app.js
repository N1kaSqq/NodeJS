
const $cart = document.querySelector('#cart');
const $courses = document.querySelector('#categories')

/* const toCurrency = price => {
    return new Intl.NumberFormat('ru-RU', {
      currency: 'rub',
      style: 'currency'
    }).format(price)
  } */

const toDate = date => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date(date))
  }

  /* document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent)
  }) */
  
  document.querySelectorAll('.date').forEach(node => {
    node.textContent = toDate(node.textContent)
  })

if ($cart) {
    $cart.addEventListener('click', event => {
        if (event.target.classList.contains('js-remove') || event.target.parentElement.classList.contains('js-remove')) {
            const id = event.target.dataset.id ? event.target.dataset.id : event.target.parentElement.dataset.id;
            const csrf = event.target.dataset.csrf ? event.target.dataset.csrf : event.target.parentElement.dataset.csrf;
            try {
                fetch('/cart/remove/' + id, {
                    method: 'delete',
                    headers: {
                        'X-XSRF-TOKEN': csrf
                    },
                }).then((res)=>{
                    return res.json();
                }).then((cart)=>{
                    if (cart.courses.length) {
                        const html = cart.courses.map((item)=>{
                            return `
                            <tr>
                            <td>${item.title}</td>
                            <td>${item.count}</td>
                            <td>
                                <a href="/courses/${item._id}" target="_blank" class="btn btn-outline-warning">Подробнее</a>
                                <button class="btn btn-outline-danger js-remove" data-id="${item._id}"> <img style="height: 20px; width: 17px;" src="/img/trash.svg" alt=""></button>
                            </td>
                          </tr>
                            `
                        }).join('');
    
                        $cart.querySelector('tbody').innerHTML = html;
                        $cart.querySelector('.price').textContent = cart.price;
                    } else {
                        // обнуляем таблтцу
                        $cart.innerHTML = '<p>Корзина пуста</p>'
                    }
                })
            } catch (error) {
                console.log(error);
            }
             
        }
    })
}

if ($courses) {
    $courses.addEventListener('click', (event)=>{
        if (event.target.classList.contains('js-remove') || event.target.parentElement.classList.contains('js-remove')) {
            const id = event.target.dataset.id ? event.target.dataset.id : event.target.parentElement.dataset.id;
            const csrf = event.target.dataset.csrf ? event.target.dataset.csrf : event.target.parentElement.dataset.csrf;
            try {
                fetch(`/courses/remove/${id}`, {
                    method: 'delete',
                    headers: {
                        'X-XSRF-TOKEN': csrf
                    },
                }).then(res => res.json())
                .then((NewCourses)=>{
                    if (NewCourses.length) {
                        const html = NewCourses.map(item =>{
                            return `
                            <div class="category card">
                            <img src="${item.img}" class="card-img-top" alt="${item.title}">
                            <div class="card-body">
                                <h5 class="card-title">${item.title}</h5>
                                <h5 class="card-title">${item.price} $</h5>
                                <p class="card-text">${item.description}</p>
                                <form style="display: inline;" action="/cart/add" method="POST">
                                    <input type="hidden" name="id" value="${item._id}">
                                    <button class="btn btn-success">Купить</button>
                                </form>
                                <a href="/courses/${item._id}" target="_blank" class="btn btn-outline-warning">Подробнее</a>
                                <a href="/courses/${item._id}/edit?allow=true"  class="btn btn-outline-warning"> <img style="height: 20px; width: 17px;" src="/img/edit.svg" alt=""></a>
                                <button class="btn btn-outline-danger js-remove" data-id="${item._id}"> <img style="height: 20px; width: 17px;" src="/img/trash.svg" alt=""></button>
                            </div>
                        </div>
                            `
                        }).join('');
                        $courses.innerHTML = html;
                    } else {
                        $courses.innerHTML = '<p>Корзина пуста</p>'
                    }
                })
            } catch (error) {
                console.log(error);
            }


        }
    })
}

/* login- */

document.querySelectorAll('.login-btn').forEach(el => {
        el.addEventListener('click', (event)=>{
            document.querySelector('.login-form-signin').classList.toggle('login-form-signin-left');
            document.querySelector('.login-form-signup').classList.toggle('login-form-signup-left');
            document.querySelector('.login-frame').classList.toggle('login-frame-long');
            document.querySelector('.login-signup-inactive').classList.toggle('login-signup-active');
            document.querySelector('.login-signin-active').classList.toggle('login-signin-inactive');
            document.querySelector('.login-forgot').classList.toggle('login-forgot-left');
        })
})



if (document.URL === 'http://localhost:3000/auth/login#register') {
    document.querySelector('.login-form-signin').classList.toggle('login-form-signin-left');
            document.querySelector('.login-form-signup').classList.toggle('login-form-signup-left');
            document.querySelector('.login-frame').classList.toggle('login-frame-long');
            document.querySelector('.login-signup-inactive').classList.toggle('login-signup-active');
            document.querySelector('.login-signin-active').classList.toggle('login-signin-inactive');
            document.querySelector('.login-forgot').classList.toggle('login-forgot-left');
} else {
    
}