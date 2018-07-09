<template>
    <Tree :data="data" @on-check-change="handleCheck" show-checkbox></Tree>   
</template>

<script>
import { getSysMenus } from "@/actions/sys";
export default {
    name:"menu-tree-selector",
    props:{
        menuIds:{
            type:Array,
            default:()=>{
                return []
            }
        }
    },
    data(){
        return {
            data:[]
        }
    },
    activated(){
        this.init()
    },
    methods:{
        init(){
            getSysMenus().then(res=>{
                console.log(res)
            })
        },
        handleCheck(arr){
            console.log(arr)
        }
    }
}
</script>

<style>

</style>
