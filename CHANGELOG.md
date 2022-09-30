 # Changelog NodeLeap 🚀
| Este formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), e o projeto adere ao versionamento semântico [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<img src="https://img.shields.io/static/v1?label=&message=ALMOST.DONE&color=inactive" />

**Status de response incorretos.** _(FIXED)_
- [PR ⇒ Fix/exception template](https://github.com/loomi/node-leap/pull/31)
- Resolução de _statusCode_ incorretos nas respostas dos controllers de _create_ e _delete_. 

**Implementação de XLSX** _(ADDED)_
- [_PR ⇒ Feature/xlsx implemetation #26_](https://github.com/loomi/node-leap/pull/26)
- Implementar configuração inicial para suporte a processamento de xlsx.
- Adição da lib de **xlsx** ao projeto

**Testes end-to-end** _(ADDED)_
- [_PR ⇒ Feature/tests e2e #26_](https://github.com/loomi/node-leap/pull/25)
- Criação dos templates e estrutura para testes end to end.

---

<img src="https://img.shields.io/static/v1?label=&message=UNRELEASED&color=inactive" />

※ Adicionar ferramenta de debug.

※ Implementar configuração inicial para o uso de websockets.

※ Implementar configuração inicial para cronjob.

※  Escrever testes de Auth.

※  Refatorar esquema de validação.

※  Refatorar implementação padrão na qual validamos se algo está habilitado ou não.

※  Corrigir os status code mostrados no swagger.       

---

<img src="https://img.shields.io/static/v1?label=&message=ADDED&color=brightgreengreen" /> **2022-09-22** </br>
<img src="https://img.shields.io/static/v1?label=&message=[1.0.0]&color=gray" />
**Rate limite**
[<img src = "https://avatars.githubusercontent.com/u/61945340?s=120&v=4" style="width:25px;height:25px;"/>](https://github.com/BrunoSSantana)
[<img src = "https://avatars.githubusercontent.com/u/67443852?v=4" style="width:25px;height:25px;"/>](https://github.com/isaquetdiniz)
- Implementada em: [_Feature/rate limit (#29)_](https://github.com/loomi/node-leap/commit/dff17ba052570f7b320d5579e2fc4eb434ad7852)
- Criado e adicionado middleware para limitar a quantidade de requests feitos de forma consecutiva à partir de determinado browser
- Adição da lib **express-rate-limit** ao projeto

<img src="https://img.shields.io/static/v1?label=&message=ADDED&color=brightgreengreen" /> **2022-09-21** </br>
<img src="https://img.shields.io/static/v1?label=&message=[1.0.0]&color=gray" />
**Adição de ferramenta para teste de carga.** [<img src = "https://avatars.githubusercontent.com/u/67443852?v=4" style="width:25px;height:25px;"/>](https://github.com/isaquetdiniz)
- Implementada em: [_Feature/performance (#27)_](https://github.com/loomi/node-leap/commit/0d8e6de4416f46dbc816bf458dac146a5502974a)
- Instaladas libs de **autocannon** e **clinic** para dar suporte a esse tipo de testes
- Configurados os scripts básicos para [testes de carga](https://github.com/loomi/node-leap/commit/0d8e6de4416f46dbc816bf458dac146a5502974a#diff-982a8f66c9c855f4df1f09ef4aefd6af59c3c6059028b27b1c880b996e7ac4fd) e [verificação da saúde](https://github.com/loomi/node-leap/commit/0d8e6de4416f46dbc816bf458dac146a5502974a#diff-636f5e485df34bdbbc600f0599e08a8f723ce5d370d10e155f01433e8c0ba878) do projeto

<img src="https://img.shields.io/static/v1?label=&message=ADDED&color=brightgreengreen" /> <img src="https://img.shields.io/static/v1?label=&message=REMOVED&color=critical" /> **2022-08-15** </br>
<img src="https://img.shields.io/static/v1?label=&message=[1.0.0]&color=gray" />
**Automação na criação de mocks.** [<img src = "https://avatars.githubusercontent.com/u/34968112?v=4" style="width:25px;height:25px;"/>](https://github.com/guilherme4g)
- Implementada em: [_Feature/auto mock (#23)_](https://github.com/loomi/node-leap/commit/b879ecffb717ed5784392910c0fe27c8dee75b01)
- Utilizadas as libs **jest-ts-auto-mock**, **ts-auto-mock** e **ts-auto-mock/extension** para facilitar a criação de testes unitários dos serviços
- Removido todos os arquivos de testes com repositórios mocados manualmente
- Reconfigurada a maneira como a conexão com o banco de dados é criada dentro do ambiente de testes
- Refatorados todos os testes previamente escritos com a nova arquitetura
- Reescritos os plopfiles de teste para seguirem o novo modelo de escrita de testes

<img src="https://img.shields.io/static/v1?label=&message=ADDED&color=brightgreengreen" /> **2022-08-15** </br>
<img src="https://img.shields.io/static/v1?label=&message=[1.0.0]&color=gray" />
**Implementação da estrutura base do S3.** [<img src = "https://avatars.githubusercontent.com/u/85639170?v=4" style="width:25px;height:25px;"/>](https://github.com/arthurbs17)
- Implementada em: [_Feature/aws s3 configuration (#21)_](https://github.com/loomi/node-leap/commit/78440404a8df90488809c3ac7bdacc54b1c54add)
- Configurados serviços básicos de integração com AWS S3 para dar suporte a features futuras
- Criadas funcionalidades padrões de:
  - **upload** _(AwsS3UploadArchive)_;
  - **deleção** _(AwsS3DeleteArchive)_;
  - **update handler** _(AwsS3FileUpdateHandler)_; e
  - **assinatura** _(AwsS3SignedUrlGenerator)_ de arquivos. 

<img src="https://img.shields.io/static/v1?label=&message=ADDED&color=brightgreengreen" /> **2022-08-08** </br>
<img src="https://img.shields.io/static/v1?label=&message=[1.0.0]&color=gray" />
**Criação do modelo de report para o projeto.** [<img src = "https://avatars.githubusercontent.com/u/55456236?v=4" style="width:25px;height:25px;"/>](https://github.com/argas7)
- Implementada em: [_Feat/add changelog (#22)_](https://github.com/loomi/node-leap/commit/c937be15c88302af895c8987e94fe52c46af36d8)
- À partir desta data foram iniciados os registros de todas as alterações implementadas no NodeLeap
