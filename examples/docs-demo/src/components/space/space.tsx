import { defineComponent, PropType } from 'vue'

export default defineComponent({
    props: {
        title: {
            type: String as PropType<string>,
            default: '',
        },
    },
    setup(props, context) {
        return () => (
            <>
                <div style="color: red">=={props.title}==</div>
            </>
        )
    },
})
