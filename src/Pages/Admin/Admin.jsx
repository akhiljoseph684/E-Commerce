import React, { useContext, useEffect, useState } from 'react';
import './Admin.css'
import { AuthContext } from '../../AuthContext';
import logo from './../../assets/logo.png';
import add_products from './../../assets/add-products-icon.png';
import order from './../../assets/order-icon.png';
import view_products from './../../assets/view-products-icon.png';
import users from './../../assets/users-icon.png';
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import AddProducts from '../../Components/AddProducts/AddProducts';
import { useLocation } from 'react-router-dom';
import ViewProducts from '../../Components/ViewProducts/ViewProducts';
import Order from '../../Components/Order/Order';
import Users from '../../Components/users/Users';
import AdminLogin from '../../Components/AdminLogin/AdminLogin';
function Admin() {

    
    const {setAdmin, adminLogged, setAdminLogged} = useContext(AuthContext)
    const [menu, setMenu] = useState('')
    const {pathname} = useLocation();
    const [bar, setBar] = useState(false)
    const navigate = useNavigate()

    let currentMenu;
        useEffect(() => {
            currentMenu = pathname.split('/')[2] || '';
            const check = async () => {
                let res = await localStorage.getItem('admin');
                if(!currentMenu && res){
                    navigate('/admin/add-products')
                }
                if(!res){
                    navigate('/admin')
                    setAdminLogged(false);
                    return;
                }
                setAdminLogged(true)
            }
            check()
            setMenu(currentMenu)
        }, [pathname])

    useEffect(() => {
        setAdmin(true)
        return () => {
            setAdmin(false)
        }
    }, [])

    const adminLogout = async () => {
        await localStorage.removeItem('admin');
        navigate('/admin')
    }

    const onsidebarChange = (menu_content) => {
        if (menu === menu_content) return;
        setBar(false)
        setMenu(menu_content);
        navigate(`/admin/${menu_content}`)
    }
  return (
    <div className="admin">
        <nav>
            {menu && <div className="bar-icon" onClick={() => setBar(prev => !prev)}>
                {
                    bar ?
                    <i className="fa-solid fa-x"></i>
                    : <i className="fa-solid fa-bars"></i>
                }
            </div>}
            <div className="nav-left">
                <img src={logo} alt="" />
                <h1><i>Smart Buy</i></h1>
            </div>
            {
                adminLogged ?
                <div className="nav-right">
                    <button onClick={adminLogout}>Logout</button>
                </div> :
                <div></div>
            }
        </nav>
        <div className="main">
            {
                menu &&
            <div className={`sidebar ${bar ? 'show-sidebar' : ''}`}>
                <div className={`menu ${menu === 'add-products' ? 'active-sidebar' : ''}`} onClick={() => onsidebarChange('add-products')}>
                    <img src={add_products} alt="" />
                    <p>Add Products</p>
                </div>
                <div className={`menu ${menu === 'view-products' ? 'active-sidebar' : ''}`} onClick={() => onsidebarChange('view-products')}>
                    <img src={view_products} alt="" />
                    <p>View Products</p>
                </div>
                <div className={`menu ${menu === 'orders' ? 'active-sidebar' : ''}`} onClick={() => onsidebarChange('orders')}>
                    <img src={order} alt="" />
                    <p>All Orders</p>
                </div>
                <div className={`menu ${menu === 'users' ? 'active-sidebar' : ''}`} onClick={() => onsidebarChange('users')}>
                    <img src={users} alt="" />
                    <p>All Users</p>
                </div>
            </div>
        }
            {bar && <div className="blank" onClick={() => setBar(prev => !prev)}></div>}
            <div className="content">
                <Routes>
                    <Route index element={<AdminLogin />} />
                    <Route path="add-products" element={<AddProducts />} />
                    <Route path="add-products/:id" element={<AddProducts />} />
                    <Route path="view-products" element={<ViewProducts />} />
                    <Route path="orders" element={<Order />} />
                    <Route path="users" element={<Users />} />
                </Routes>
            </div>
        </div>
    </div>
  )
}

export default Admin