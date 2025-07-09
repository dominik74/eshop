import s from '../less/errorbar.module.less'

interface Props {
    errorMessage: string
}

export default function ErrorBar(props: Props) {
    return (
        <div className={s.component}>
            {props.errorMessage}
        </div>
    )
}