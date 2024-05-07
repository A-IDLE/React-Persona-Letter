import React from 'react';
import '../mailList/mailList.css';

function MailApp() {
    return (
        <div>
            <div className="header">Persona Letter</div>
            <div className="main-container">
                <div className="sidebar">
                    <div className="contact active">헤르미온느 그레인저</div>
                    <div className="contact">받은 편지함</div>
                    <div className="contact">보낸 편지함</div>
                    <div className="menu-item">My page</div>
                    <div className="menu-item">Log out</div>
                </div>
                <div className="content">
                    <table>
                        <tbody>
                            <tr>
                                <td><input type="checkbox" /></td>
                                <td>Nunc aliquet</td>
                                <td>Lorem ipsum dolor sit amet...</td>
                                <td>2024.04.24</td>
                            </tr>
                            {/* More rows as before */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default MailApp;
