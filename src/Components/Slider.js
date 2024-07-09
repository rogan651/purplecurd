import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaBoxes, FaSignInAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './Style/Sliderss.css';

const Slider = () => {
  const [isMasterOpen, setIsMasterOpen] = useState(false);

  const toggleMasterMenu = () => {
    setIsMasterOpen(!isMasterOpen);
  };

  return (
    <div className='sidebar'>
      <ul>
        <li className={`dropdown ${isMasterOpen ? 'open' : ''}`} onClick={toggleMasterMenu}>
          <Link to='/'> Master {isMasterOpen ? <FaChevronUp /> : <FaChevronDown />}
          </Link>
          {isMasterOpen && (
            <ul className='dropdown-menu'>
              <li><Link to='/custom'><FaUser /> Customer Master</Link></li>
              <li><Link to='/SupplierMaster'><FaBoxes /> Supplier Master</Link></li>
            </ul>
          )}
        </li>
        <li><Link to='/Login'><FaSignInAlt /> Login</Link></li>
      </ul>
    </div>
  );
}

export default Slider;
