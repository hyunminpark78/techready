ARG CBP_ACCOUNT_ID=$CBP_ACCOUNT_ID
FROM $CBP_ACCOUNT_ID.dkr.ecr.ap-northeast-2.amazonaws.com/cbp/nginx:stable-alpine

ARG SPRING_ACTIVE_PROFILE
RUN rm /etc/nginx/conf.d/default.conf
COPY  nginx.$SPRING_ACTIVE_PROFILE.conf /etc/nginx/conf.d/front.conf
COPY /dist/ /usr/share/nginx/html/front
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
