const pool = require('../config/connectDB');
const { jwtDecode } = require('jwt-decode');

let checkData = async (req, res) => {
    let d = req.body
    console.log(d)
}

let getCheck = async (req, res) => {
    return res.render('checkrole.ejs')  
}

let checkRole = async (req, res) => {
    var token = req.params.token
    if (token == 'undefined') {
        return res.redirect('/sign-in')
    }
    else {
        const decoded = jwtDecode(token);
        if (decoded.role == "admin") {
            const [rows, field] = await pool.execute ('select * from order_products');
            const [rows2, field2] = await pool.execute('select * from `order`');
            const [rank, field3] = await pool.execute('select full_name as fN, total_expenditure as tE from user where role = "user"');

            let totalOrders = rows2.length;
            let totalProduct = 0;
            let totalRevenue = 0;

            let totalOrdersS = 0; //Tổng đơn thành công
            let totalProductS = 0; 

            

            // Tính tỉ lệ đơn thành công, tổng doanh thu
            for (let i = 0; i<rows2.length; i++) {    
                if (rows2[i].status == 'Complete') {
                    totalOrdersS ++;
                    totalRevenue += Number(rows2[i].total_price);
                    for (let j = 0; j < rows.length; j++) {
                    if (rows[j].order_id == rows2[i].order_id) {
                            totalProductS += rows[j].quantity;
                    }
                    }
                }
            }
            let successOrderRate = totalOrdersS/totalOrders * 100;


            //Xếp hạng người dùng
            let tmp = {};
            for (let i = 0; i<rank.length - 1; i++) {
                for (let j = i+1; j < rank.length; j++) {
                    if (rank[i].tE < rank[j].tE) {
                        tmp = rank[i];
                        rank[i] = rank[j];
                        rank[j] = tmp;
                    }
                }
            }

            //Đổi về triệu vnđ
            totalRevenue /= 1000000;

            // set độ dài của bảng xếp hạng, chỉ hiển thị tối đa top 10;
            let rankL = Math.min(10, rank.length);
            
            let data = {totalOrders, totalProductS, totalRevenue, successOrderRate}

            return res.render('admin/adminPage.ejs', { data: data, rank: rank, rankL: rankL});
        }
        else {
            var data = []
            const [rows, field] = await pool.execute ('select product_id, product_name, price from product');
            data = rows;
            const [rows2, field2] = await pool.execute ('select * from category');
            for (let i = 0; i<data.length; i++) {
                const [rows3, field3] = await pool.execute('select image_url from product_image where product_id = ? and is_thumbnail = 1', [rows[i].product_id])
                data[i].image_url = rows3[0].image_url;
                const [rows4, field4] = await pool.execute('SELECT op.product_id, o.order_id, SUM(op.quantity) AS total_quantity FROM `order` o JOIN order_products op ON o.order_id = op.order_id WHERE o.status = ? and product_id = ? GROUP BY o.order_id', ["Complete", rows[i].product_id]);
                if (rows4[0]) data[i].sold = Number(rows4[0].total_quantity);
                else data[i].sold = 0;
            }
            return res.render('user/user.ejs', {
                userId: decoded.user_id,
                data: data,
                category: rows2
            });
        }
    }
    
    
}

let getHomePage = async (req, res) => {
    var data = []
    const [rows, field] = await pool.execute ('select product_id, product_name, price from product');
    data = rows;
    const [rows2, field2] = await pool.execute ('select * from category');
    for (let i = 0; i<data.length; i++) {
        const [rows3, field3] = await pool.execute('select image_url from product_image where product_id = ? and is_thumbnail = 1', [rows[i].product_id])
        data[i].image_url = rows3[0].image_url;
        const [rows4, field4] = await pool.execute('SELECT op.product_id, o.order_id, SUM(op.quantity) AS total_quantity FROM `order` o JOIN order_products op ON o.order_id = op.order_id WHERE o.status = ? and product_id = ? GROUP BY o.order_id', ["Complete", rows[i].product_id]);
        if (rows4[0]) data[i].sold = Number(rows4[0].total_quantity);
        else data[i].sold = 0;
    }
    return res.render('index.ejs', {    category: rows2, data: data     })
}

let getFilterPage = async (req, res) => {
    const categoryId = req.params.categoryId
    var data = []
    const [rows, field] = await pool.execute ('select product_id, product_name, price from product where category_id = ?', [categoryId]);
    data = rows;
    const [rows2, field2] = await pool.execute ('select * from category');
    for (let i = 0; i<data.length; i++) {
        const [rows3, field3] = await pool.execute('select image_url from product_image where product_id = ? and is_thumbnail = 1', [rows[i].product_id])
        data[i].image_url = rows3[0].image_url;
        const [rows4, field4] = await pool.execute('SELECT op.product_id, o.order_id, SUM(op.quantity) AS total_quantity FROM `order` o JOIN order_products op ON o.order_id = op.order_id WHERE o.status = ? and product_id = ? GROUP BY o.order_id', ["Complete", rows[i].product_id]);
        if (rows4[0]) data[i].sold = Number(rows4[0].total_quantity);
        else data[i].sold = 0;
    }
    return res.render('index.ejs', {    category: rows2, data: data     })
}

let searchProductsPage = async(req, res) => {
    const key = req.params.key
    var data = []
    const [rows, field] = await pool.execute ('select product_id, product_name, price from product');
    var cnt = 0;
    for (let i = 0; i < rows.length; i++){
        if(String(rows[i].product_id).includes(key) || rows[i].product_name.includes(key)) {
            data[cnt] = rows[i];
            cnt ++;
        }
    }
    const [rows2, field2] = await pool.execute ('select * from category');
    for (let i = 0; i<data.length; i++) {
        const [rows3, field3] = await pool.execute('select image_url from product_image where product_id = ? and is_thumbnail = 1', [rows[i].product_id])
        data[i].image_url = rows3[0].image_url;
        const [rows4, field4] = await pool.execute('SELECT op.product_id, o.order_id, SUM(op.quantity) AS total_quantity FROM `order` o JOIN order_products op ON o.order_id = op.order_id WHERE o.status = ? and product_id = ? GROUP BY o.order_id', ["Complete", rows[i].product_id]);
        if (rows4[0]) data[i].sold = Number(rows4[0].total_quantity);
        else data[i].sold = 0;
    }
    return res.render('index.ejs', {    category: rows2, data: data     })
}

let getProductsAdmin = async (req, res) => {
    const [rows, field] = await pool.execute ('select * from product');
    const [rows2, field2] = await pool.execute ('select * from category');
    return res.render('admin/productsAdmin.ejs', {
        data: rows,
        category: rows2
    });
}

let getOrdersAdmin = async (req, res) => {
    const [rows, field] = await pool.execute ('select * from `order`');
    for (let i = 0; i < rows.length; i++) {
        const [rows2, field2] = await pool.execute('select full_name from `user` where user_id = ?', [rows[i].user_id])
        
        rows[i].user_name = rows2[0].full_name
    }
    return res.render('admin/orderAdmin.ejs', {
        data: rows
    });
}

let getCustomerAdmin = async (req, res) => {
    var role = "user"
    const [rows, field] = await pool.execute ('select * from `user` where role = ?', [role]);
    return res.render('admin/customerAdmin.ejs', {
        data: rows
    });
}

let getSignUpPage = async (req, res) => {
    return res.render('signup.ejs');
}

let getSignInPage = async (req, res) => {
    return res.render('signin.ejs');
}

let creatProduct = async (req, res) => {
    const [rows, field] = await pool.execute('select * from category')
    return res.render('admin/creatProduct.ejs', { data: rows  });
}

let getProductSearchCategory = async (req, res) => {
    const id = req.params.id
    const [rows, field] = await pool.execute ('select * from product where category_id = ?', [id]);
    const [rows2, field2] = await pool.execute ('select * from category');
    return res.render('admin/productsAdmin.ejs', {
        data: rows,
        category: rows2
    });

}

let getDetailProductPage = async (req, res) => {
    var id = req.params.id
    const [rows, field] = await pool.execute('select * from product where product_id = ?', [id])
    const [rows2, field2] = await pool.execute('select category_name from category where category_id = ?', [rows[0].category_id]) 
    rows[0].category_name = rows2[0].category_name
    const [rows3, field3] = await pool.execute('select * from product_image where product_id = ?', [id])
    return res.render('admin/detailProduct.ejs', {
        data: rows[0],
        img: rows3
    })
}

let getDetailOrder = async (req, res) => {
    let id = req.params.id;
    const [rows, field] = await pool.execute('select * from `order` where order_id = ?', [id])

    var user_id = rows[0].user_id

    const [rows2, field2] = await pool.execute('select * from order_products where order_id = ?', [id])
    const [rows3, field3] = await pool.execute('select * from user where user_id = ?', [user_id])
    const [rows4, field4] = await pool.execute('select * from address where user_id = ? and is_default = ?', [user_id, 1])
    rows[0].user_name = rows3[0].full_name;
    rows[0].phone_number = rows3[0].phone_number;
    return res.render('admin/detailOrder.ejs', {   data: rows[0], products: rows2, address: rows4[0]  })
}

let getDetailCustomer = async (req, res) => {
    const id = req.params.id;
    const [rows, field] = await pool.execute('select * from user where user_id = ?', [id])
    const [rows2, field2] = await pool.execute('select * from address where user_id = ?', [id])
    return res.render('admin/detailCustomer.ejs', {   data: rows[0], address: rows2  })
}

let searchOrders = async (req, res) => {
    const key = req.params.key
    const [rows, field] = await pool.execute ('select * from `order`');
    let data = []
    var cnt = 0;

    for (let i = 0; i < rows.length; i++) {
        const [rows2, field2] = await pool.execute('select full_name from `user` where user_id = ?', [rows[i].user_id])
        if (String(rows[i].order_id).includes(key) || rows2[0].full_name.includes(key)) {
            rows[i].user_name = rows2[0].full_name;
            data[cnt] = rows[i];
            cnt++;
        }
    }
    return res.render('admin/orderAdmin.ejs', {
        data: data
    });
}

let searchProducts = async (req, res) => {
    const key = req.params.key
    var data = []
    var cnt = 0;
    const [rows, field] = await pool.execute ('select * from product');
    for (let i = 0; i < rows.length; i++){
        if(String(rows[i].product_id).includes(key) || rows[i].product_name.includes(key)) {
            data[cnt] = rows[i];
            cnt ++;
        }
    }
    const [rows2, field2] = await pool.execute ('select * from category');
    return res.render('admin/productsAdmin.ejs', {
        data: data,
        category: rows2
    });
}

let searchCustomers = async (req, res) => {
    const key = req.params.key
    var role = "user";
    var data = []
    var cnt = 0 ;
    const [rows, field] = await pool.execute ('select * from `user` where role = ?', [role]);
    
    for (let i = 0; i < rows.length; i++) {
        if(String(rows[i].user_id).includes(key) || rows[i].full_name.includes(key)) {
            data[cnt] = rows[i];
            cnt ++;
        }
    }
    return res.render('admin/customerAdmin.ejs', {
        data: data
    });
}

let orderOfCustomer = async (req, res) => {
    const id = req.params.id;
    const [rows, field] = await pool.execute ('select * from `order` where user_id = ?', [id]);
    for (let i = 0; i < rows.length; i++) {
        const [rows2, field2] = await pool.execute('select full_name from `user` where user_id = ?', [rows[i].user_id])
        
        rows[i].user_name = rows2[0].full_name
    }
    return res.render('admin/orderAdmin.ejs', {
        data: rows
    });

}





let detailProductUser = async (req, res) => {
    const userId = req.params.userId
    const productId = req.params.productId;

    try {
        // Sử dụng async/await để đảm bảo xử lý đồng bộ
        const [rows, fields] = await pool.execute('SELECT p.*, c.category_name FROM product AS p JOIN category AS c ON p.category_id = c.category_id WHERE p.product_id = ?', [productId]);
    
        if (rows.length === 0) {
            return res.status(404).send('Không tìm thấy sản phẩm'); // Xử lý trường hợp không tìm thấy sản phẩm
        }
    
        const data = rows[0];
    
        // Khởi tạo thuộc tính sold nếu chưa tồn tại
        data.sold = 0;
    
        // Lấy danh sách hình ảnh sản phẩm
        const [rows3, fields3] = await pool.execute('SELECT * FROM product_image WHERE product_id = ?', [productId]);
    
        // Lấy tổng số lượng đã bán
        const [rows4, fields4] = await pool.execute('SELECT op.product_id, o.order_id, SUM(op.quantity) AS total_quantity FROM `order` o JOIN order_products op ON o.order_id = op.order_id WHERE o.status = ? AND product_id = ? GROUP BY o.order_id', ["Complete", productId]);
    
        if (rows4.length > 0) {
            data.sold = Number(rows4[0].total_quantity);
        }
    
        // Trả về dữ liệu cho trang web
        return res.render('user/detailProduct.ejs', {
            userId: userId,
            data: data,
            arrImage: rows3
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Error'); // Xử lý trường hợp lỗi truy vấn
    }
}

let searchUserProducts = async (req, res) => {
    const userId = req.params.userId 
    const key = req.params.key
    var data = []
    try {
        const [rows, field] = await pool.execute ('select product_id, product_name, price from product');
        var cnt = 0;
        for (let i = 0; i < rows.length; i++){
            if(String(rows[i].product_id).includes(key) || rows[i].product_name.includes(key)) {
                data[cnt] = rows[i];
                cnt ++;
            }
        }
        const [rows2, field2] = await pool.execute ('select * from category');
        for (let i = 0; i<data.length; i++) {
            const [rows3, field3] = await pool.execute('select image_url from product_image where product_id = ? and is_thumbnail = 1', [rows[i].product_id])
            data[i].image_url = rows3[0].image_url;
            const [rows4, field4] = await pool.execute('SELECT op.product_id, o.order_id, SUM(op.quantity) AS total_quantity FROM `order` o JOIN order_products op ON o.order_id = op.order_id WHERE o.status = ? and product_id = ? GROUP BY o.order_id', ["Complete", rows[i].product_id]);
            if (rows4[0]) data[i].sold = Number(rows4[0].total_quantity);
            else data[i].sold = 0;
        }
        return res.render('user/user.ejs', {
            userId: userId,
            data: data,
            category: rows2
        });
    } catch(error) {
        console.error('Error:', error);
        return res.status(500).send('Error');
    }
}

let getUserProfile = async (req, res) => {
    function hideString(str) {
        return '*'.repeat(str.length);
    }
    const userId = req.params.userId;
    try {
        const [rows, fields] = await pool.execute('select * from user where user_id = ?', [userId]);
        rows[0].date_of_birth = (new Date(rows[0].date_of_birth)).toDateString();
        rows[0].password = hideString(rows[0].password);
        const [rows2, field2] = await pool.execute('select * from address where user_id = ?', [userId])
        return res.render('user/profile.ejs', {     userId: userId, data: rows[0], address: rows2   })
    } catch(error) {
        console.error('Error:', error);
        return res.status(500).send('Error');
    }
    
}

let getCartUserPage = async (req, res) => {
    const userId = req.params.userId;
    try {
        const [rows, field] = await pool.execute('SELECT cp.* , pi.image_url,p.product_name, p.price, c.category_name FROM cart_product AS cp JOIN product AS p ON cp.product_id = p.product_id JOIN product_image AS pi ON cp.product_id = pi.product_id AND pi.is_thumbnail = 1 JOIN category AS c ON p.category_id = c.category_id');
        return res.render('user/cart.ejs', {
            userId: userId,
            data: rows
        })
    } catch(error) {
        console.error('Error:', error);
        return res.status(500).send('Error');
    }    
}

let creatOrder = async (req, res) => {
    const userId = req.params.userId;
    const orderArrayString = req.query.orderArray;
    
    let data = []
    let totalOrderAmount = 0;
    try {
        if (orderArrayString) {
            const orderArray = JSON.parse(decodeURIComponent(orderArrayString));
            for (let i = 0; i < orderArray.length; i++) {
                const [rows, field] = await pool.execute('select p.product_id, p.product_name, p.price, pi.image_url from product as p, product_image as pi where p.product_id = ? and pi.product_id = ? and pi.is_thumbnail = 1', [orderArray[i].product_id, orderArray[i].product_id]);
                var total = Number(rows[0].price)*orderArray[i].quantity;
                totalOrderAmount += total;
                data[i] = rows[0];
                data[i].product_id = orderArray[i].product_id;
                data[i].quantity = orderArray[i].quantity;
                data[i].total = String(total);
            }
            const [rows2, field] = await pool.execute('select * from address where user_id = ?', [userId]);
            res.render('user/createOrder.ejs', { 
                userId: userId,
                data: data,
                totalOrderAmount: String(totalOrderAmount),
                address: rows2
            });
        } else {
            res.status(400).send('OrderArray not found.');
        }
    } catch(error) {
        console.error('Error: ', error);
        return res.status(500).send('Error');
    }
}

let orderUserPage = async (req, res) => {
    const userId = req.params.userId;
    var data = [];
    try {
        const [rows, field] = await pool.execute('select * from `order` where user_id = ?', [userId]);
        data = rows;
        for (let i = 0; i < data.length; i++) {
            const [rows2, field2] = await pool.execute('select * from `order_products` where `order_id` = ?', [data[i].order_id]);
            data[i].products = rows2;
            const [rows3, field3] = await pool.execute('select * from address where address_id = ?', [data[i].address_id]);
            data[i].address = rows3[0]
        }
        return res.render('user/order.ejs', {    userId: userId, data: data  })
    } catch(error) {
        console.error('Error: ', error);
        return res.status(500).send('Error');
    }
    
}

module.exports = {
    getCheck, getProductsAdmin, getSignUpPage, creatProduct,
    getSignInPage, getOrdersAdmin, getCustomerAdmin, checkRole,
    checkData, getDetailProductPage, getProductSearchCategory, getDetailOrder,
    getDetailCustomer, searchOrders, searchProducts, searchCustomers,
    orderOfCustomer, detailProductUser, getUserProfile, getHomePage,
    getFilterPage, searchProductsPage, searchUserProducts, getCartUserPage,
    creatOrder, orderUserPage
}