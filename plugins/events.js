import Vue from 'vue';

export default function (context, inject) {
    inject('bus', new Vue());
}
