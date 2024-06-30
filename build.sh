export $(grep -v '^#' .env | xargs)
sed "s/{MY_PRINCIPAL_ID}/$MY_PRINCIPAL_ID/" src/token_backend/main.mo > src/token_backend/main.mo.tmp
mv src/token_backend/main.mo.tmp src/token_backend/main.mo
dfx build
