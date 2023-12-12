const pool = require('../config/connectDB');

let getAdminPage = async (req, res) => {
    const [rows, field] = await pool.execute ('select * from order_products');
    const [rows2, field2] = await pool.execute('select * from `order`');
    const [rank, field3] = await pool.execute('select full_name as fN, total_expenditure as tE from user');

    let totalOrders = rows2.length;
    let totalProduct = 0;
    let totalRevenue = 0;

    let totalOrdersS = 0; //Tổng đơn thành công
    let totalProductS = 0;

    

    // Tính tỉ lệ đơn thành công, tổng doanh thu
    for (let i = 0; i<rows2.length; i++) {
        
        if (rows2[i].status = 'delivered') {
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

let getProductsAdmin = async (req, res) => {
    const [rows, field] = await pool.execute ('select * from product');
    return res.render('productsAdmin.ejs', {
        data: rows
    });
}

let getOrdersAdmin = async (req, res) => {
    const [rows, field] = await pool.execute ('select * from `order`');
    return res.render('orderAdmin.ejs', {
        data: rows
    });
}

let getCustomerAdmin = async (req, res) => {
    const [rows, field] = await pool.execute ('select * from `user`');
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

module.exports = {
    getAdminPage, getProductsAdmin, getSignUpPage, getSignInPage,
    getOrdersAdmin, getCustomerAdmin
}