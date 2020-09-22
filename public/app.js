
const $cart = document.querySelector('#cart');

if ($cart) {
    $cart.addEventListener('click', event => {
        if (event.target.classList.contains('js-remove') || event.target.parentElement.classList.contains('js-remove')) {
            const id = event.target.dataset.id ? event.target.dataset.id : event.target.parentElement.dataset.id;
            try {
                fetch('/cart/remove/' + id, {
                    method: 'delete',
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

