import User from "../models/User.js";


export const getAllUsers = async(req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.userId } });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const getUserById = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const toggleUserPrivacy = async(req,res) => {
    const {userId} = req.params
    const {isPrivate} = req.body
    try {
        const user = await User.findByIdAndUpdate(userId, { isPrivate }, { new: true });
        if (!user) {
          return res.status(404).send({ message: 'Kullanıcı bulunamadı' });
        }
        res.send(user);
      } catch (error) {
        res.status(500).send({ message: 'Güncelleme işlemi başarısız', error });
      }
}