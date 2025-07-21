import { Link } from 'react-router-dom'
import s from '../../less/footer.module.less'

export default function Footer() {
    return (
        <div className={s.component}>
            <div className={s.left}>
                <Link to="/about">about</Link>
                <Link to="/tos">terms of service</Link>
            </div>
            
            <div className={s.right}>
                © 2025 Dominik. All rights reserved.
            </div>
        </div>
    )
}