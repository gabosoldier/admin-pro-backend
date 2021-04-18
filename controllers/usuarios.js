const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario =  require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, resp) => {
    
    const usuarios = await Usuario.find({}, 'nombre email password role google');

    resp.json({
        ok: true,
        usuarios,
        uid: req.uid
    })
}

const crearUsuario = async(req, resp = response) => {
    
    const { email, password, nombre } = req.body;

    try{
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail){
            return resp.status(400).json({
                ok: false,
                msg: 'correo ya fue registrado'
            })
        }

        const usuario = new Usuario(req.body);

        //encriptar
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();
    
        //generar token
        const token = await generarJWT(usuario.id);

        resp.json({
            ok: true,
            usuario: usuario, 
            token
        });
    }
    catch(error){
        console.log(error);
        resp.status(500).json({
            ok: false
        })
    }

}

const actualizarUsuario = async (req, res = response) => {

    const uid = req.params.id;

    try{

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario'
            })
        }

        const {password, google, email, ...campos} = req.body;

        if (usuarioDB.email !== req.body.email){
            const existeEmeail = await Usuario.findOne({ email });
            if (existeEmail){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe el email'
                })
            }
        }

        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });
    }
    catch (error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar'
        })
    }
}

const borrarUsuario = async (req, res = response) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario'
            })
        }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });

    } catch (error) {
        return res.status(500).json({
            ok: true,
            msg: 'Error al eliminar'
        })
    }
}


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}
