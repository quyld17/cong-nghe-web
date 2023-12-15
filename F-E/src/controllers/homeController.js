const pool = require('../config/connectDB');
const { jwtDecode } = require('jwt-decode');

let checkData = async (req, res) => {
    let d = req.body
    console.log(d)
}

let getCheck = async (req, res) => {
    return res.render('checkrole.ejs')  
}

let postCheck = async (req, res) => {
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
            }
        }
        let successOrderRate = totalOrdersS/totalOrders * 100;

        // Tính tổng sản phẩm bán ra
        for (let i = 0; i<rows.length; i++) {
            totalProduct += rows[i].quantity;
        }

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
        
        let data = {totalOrders, totalProduct, totalRevenue, successOrderRate}

        return res.render('adminPage.ejs', { data: data, rank: rank, rankL: rankL});
    }
    else {
        return res.send('user')
    }
    }
    
    
}

let getProductsAdmin = async (req, res) => {
    const [rows, field] = await pool.execute ('select * from product');
    const [rows2, field2] = await pool.execute ('select * from category');
    return res.render('productsAdmin.ejs', {
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
    return res.render('orderAdmin.ejs', {
        data: rows
    });
}

let getCustomerAdmin = async (req, res) => {
    var role = "user"
    const [rows, field] = await pool.execute ('select * from `user` where role = ?', [role]);
    return res.render('customerAdmin.ejs', {
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
    return res.render('creatProduct.ejs', { data: rows  });
}

let getProductSearchCategory = async (req, res) => {
    const id = req.params.id
    const [rows, field] = await pool.execute ('select * from product where category_id = ?', [id]);
    const [rows2, field2] = await pool.execute ('select * from category');
    return res.render('productsAdmin.ejs', {
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
    return res.render('detailProduct.ejs', {
        data: rows[0],
        img: rows3
    })
}

module.exports = {
    getCheck, getProductsAdmin, getSignUpPage, creatProduct,
    getSignInPage, getOrdersAdmin, getCustomerAdmin, postCheck,
    checkData, getDetailProductPage, getProductSearchCategory
} 